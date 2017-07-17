import React from 'react';

const modes = {
    MODE_NONE: 'MODE_NONE',
    MODE_MOVE: 'MODE_MOVE',
    MODE_ZOOM: 'MODE_ZOOM',
}

const cursors = {
    DEFAULT: 'auto',
    MOVE: 'move',
    ZOOM: 'zoom-in',
    ZOOM_OUT: 'zoom-out',
}

export default class MovableCanvas extends React.Component {

    constructor(props) {
        super(props);

        const startingPosition = props.startingPosition || {x: 0, y: 0, zoom: 1.1};

        this.state = {
            isAltOn: false,
            mode: modes.MODE_NONE,
            isMouseDown: false,
            x: startingPosition.x,
            y: startingPosition.y,
            zoom: startingPosition.zoom,
            backgroundImage: ''
        }

        this.setMode = this.setMode.bind(this);

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.styleCanvas = this.styleCanvas.bind(this);
        this.styleScreen = this.styleScreen.bind(this);

        this.invokeExternalEvent = this.invokeExternalEvent.bind(this);

        this.zoomBy = this.zoomBy.bind(this);
    }

    componentDidMount() {
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }

    componentWillUnmount() {
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }

    reposition(selector) {
        const canvas = document.querySelector('#main-canvas'),
            el = document.querySelector(selector),
            {x, y, zoom} = this.state;

        if (el) {
            const canvas_boundingBox = canvas.getBoundingClientRect(),
                el_boundingBox = el.getBoundingClientRect(),
                {width, height} = canvas_boundingBox,
                {top, left} = el_boundingBox;

            const paddingX = width / zoom / 5;
            const paddingY = height / zoom / 5;

            const newX = x - left + paddingX;
            const newY = top - y + paddingY;

            this.setState({x: newX, y: newY});
            this.invokeExternalEvent(this.props.refreshSelector);
        }
    }

    componentWillReceiveProps(newProps) {
        const {focusOnElementSelector} = newProps;

        if (focusOnElementSelector !== this.state.focusOnElementSelector) {
            this.setState({focusOnElementSelector});

            setTimeout(() => {
                this.reposition(focusOnElementSelector);
            }, 0)
        }
    }

    invokeExternalEvent(event) {
        if (event) {
            event.call(this);
        }
    }

    setMode(newMode) {
        if (newMode !== this.state.mode) {
            this.setState({
                mode: newMode
            });
            return true;
        }
    }

    styleCanvas() {
        const {mode, isAltOn} = this.state;
        let cursor = cursors.DEFAULT;

        switch (mode) {
            case modes.MODE_MOVE:
                cursor = cursors.MOVE;
                break;
            case modes.MODE_ZOOM:
                cursor = isAltOn ? cursor.ZOOM_OUT : cursors.ZOOM;
                break;
        }

        return {
            ...styles.container,
            cursor,
            backgroundColor: this.props.backgroundColor
        }
    }

    styleScreen() {
        const {x, y, zoom} = this.state;

        return {
            ...styles.screen,
            left: x,
            top: y,
            zoom,
            minHeight:'100%',
        }
    }

    keyDown(e) {

        if (e.which === 90 && (e.metaKey || e.ctrlKey)) {
            this.invokeExternalEvent(this.props.undo);
        }

        // Why try/catch?
        // http://stackoverflow.com/questions/497094/how-do-i-find-out-which-dom-element-has-the-focus
        try {
            if (document.activeElement !== document.body) {
                return;
            }
        } catch (e) {

        }

        // for zoom out on touchpad
        if (e.which === 18) {
            this.setState({isAltOn: true});
        }

        switch (e.which) {
            case 32:
                if (this.setMode(modes.MODE_MOVE)) {
                    this.invokeExternalEvent(this.props.modeMoveEnter);
                }
                break;
            case 90:
                if (this.setMode(modes.MODE_ZOOM)) {
                    this.invokeExternalEvent(this.props.modeZoomEnter);
                }
                break;
        }

        return false;
    }

    keyUp(e) {

        if (this.state.mode !== modes.MODE_NONE) {
            this.invokeExternalEvent(this.props.modeCleared);
        }

        // for zoom out on touchpad
        if (e.which === 18) {
            this.setState({isAltOn: false});
        }

        this.setMode(modes.MODE_NONE);
    }

    zoomBy(ratio) {
        let {zoom} = this.state;

        zoom *= ratio;

        this.setState({
            zoom
        })

        if (this.props.setZoom) {
            this.props.setZoom(zoom);
        }

        this.invokeExternalEvent(this.props.didZoom);
    }

    onContextMenu(e) {
        if (this.state.mode === modes.MODE_ZOOM) {
            this.invokeExternalEvent(this.props.willZoom);

            e.preventDefault();
            this.zoomBy(0.8);
        }

        return false;
    }

    onMouseDown(e) {
        if (e.button === 2) {
            return false;
        }

        if (this.state.mode === modes.MODE_ZOOM) {

            this.invokeExternalEvent(this.props.willZoom);

            this.zoomBy(this.state.isAltOn ? 0.8 : 1.2);
        }

        if (this.state.mode === modes.MODE_MOVE) {
            const {x, y} = this.state;

            this.setState({
                isMouseDown: true,
                clientX: e.clientX,
                clientY: e.clientY,
                startX: x,
                startY: y,
            })
        }


    }

    onMouseMove(e) {
        if (this.state.mode !== modes.MODE_MOVE || !this.state.isMouseDown) {
            return;
        }

        const {clientX, clientY, startX, startY, zoom} = this.state,
            deltaX = (e.clientX - clientX) / zoom,
            deltaY = (e.clientY - clientY) / zoom;

        this.setState({
            x: startX + deltaX,
            y: startY + deltaY,
        })
    }

    onMouseUp() {
        this.setState({
            isMouseDown: false,
        })
    }

    renderOverlay() {
        const {overlay = {}} = this.props;
        const {url, width, height, top, left, opacity, show} = overlay;

        if (!show) {
            return null;
        }

        const style = {
            ...styles.overlay,
            backgroundImage: `url(${url})`,
            width, height, top, left, opacity,
        };

        return <div style={style}>
            {this.state.background}
        </div>
    }

    render() {
        return (
            <div
                id="main-canvas"
                style={this.styleCanvas()}
                onMouseDown={this.onMouseDown}
                onContextMenu={this.onContextMenu}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}>
                <div style={this.styleScreen()}>
                    { this.renderOverlay() }
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        position: 'absolute',
        overflow: 'hidden',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    screen: {
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        height: '100%',
        backgroundPosition: 'top center',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        zIndex: 100,
        pointerEvents: 'none',
    },
    overlayButtons: {
        position: 'absolute',
        left: 0,
        top: '-70px',
        right: 0,
        height: '50px',
        zIndex: 100,
        border: '1px solid green',
    }
}