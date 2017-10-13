import React from 'react';
import ZoomValueBox from "../ZoomValueBox/ZoomValueBox";

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

export default class InfiniteSurface extends React.Component {

    constructor(props) {
        super(props);

        const startingPosition = props.startingPosition || {x: 0, y: 0, zoom: 1};

        this.state = {
            isAltOn: false,
            mode: modes.MODE_NONE,
            isMouseDown: false,
            x: startingPosition.x,
            y: startingPosition.y,
            zoom: startingPosition.zoom,
            backgroundImage: '',
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
        this.centerOnPoint = this.centerOnPoint.bind(this);

        this.renderZoom = this.renderZoom.bind(this);
    }

    componentDidMount() {
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }

    componentWillUnmount() {
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }

    _canvasBox() {
        const canvas = document.querySelector('#main-canvas');
        return canvas.getBoundingClientRect();
    }

    reposition(selector) {
        const el = document.querySelector(selector),
            {x, y, zoom} = this.state;

        if (el) {
            const canvas_boundingBox = this._canvasBox(),
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

    invokeExternalEvent(method, ev) {
        if (method) {
            method.call(this, ev);
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

        let style = {
            ...styles.container,
            cursor,
            backgroundColor: this.props.backgroundColor
        };

        switch (mode) {
            case modes.MODE_MOVE:
                cursor = cursors.MOVE;
                break;
            case modes.MODE_ZOOM:
                cursor = isAltOn ? cursor.ZOOM_OUT : cursors.ZOOM;
                break;
        }

        if (this.props.flex) {
            style = {
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100%',
            }
        }

        return style;
    }

    styleScreen() {
        const {x, y, zoom, scale} = this.state;

        let style = {
            ...styles.screen,
            left: x,
            top: y,
            zoom,
            transform: `translate3d(0, 0, 0)`,
        }

        if (scale) {
            style = {
                ...style,
                transform: `scale(${zoom}) translate3d(0, 0, 0)`,
                transition: 'transform 0.1s ease-in-out',
                zoom: 1,
            }
        }

        return style;
    }

    keyDown(e) {

        if (e.which === 90 && (e.metaKey || e.ctrlKey)) {
            this.invokeExternalEvent(this.props.undo, e);
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
                    this.invokeExternalEvent(this.props.modeMoveEnter, e);
                }
                break;
            case 90:
                if (this.setMode(modes.MODE_ZOOM)) {
                    this.invokeExternalEvent(this.props.modeZoomEnter, e);
                }
                break;
        }

        return false;
    }

    keyUp(e) {

        if (this.state.mode !== modes.MODE_NONE) {
            this.invokeExternalEvent(this.props.modeCleared, e);
        }

        // for zoom out on touchpad
        if (e.which === 18) {
            this.setState({isAltOn: false});
        }

        this.setMode(modes.MODE_NONE);
    }

    zoomPlus(increase) {
        const {zoom} = this.state;
        const zooms = [0.6, 0.8, 1.0, 1.2, 1.4, 1.7, 2];

        let index = zooms.indexOf(zoom);

        if (index < 0) {
            index = 2;
        }

        index += increase ? 1 : -1;
        index = Math.max(Math.min(index, zooms.length - 1), 0);

        console.log('index, zoom -> ', index, zooms[index]);

        this.setState({zoom: zooms[index]});
    }

    zoomBy(ratio) {
        let {zoom} = this.state;

        zoom *= ratio;

        if (zoom < 0.5) {
            return;
        }

        if (zoom > 0.95 && zoom < 1.05) {
            zoom = 1;
        }

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
            this.invokeExternalEvent(this.props.willZoom, e);

            e.preventDefault();
            this.zoomPlus(false);
        }

        return false;
    }

    centerOnPoint(e) {
        let {zoom, x, y} = this.state;
        const clickX = e.clientX,
            clickY = e.clientY,
            canvas_boundingBox = this._canvasBox(),
            centerX = Math.floor(canvas_boundingBox.width / 2),
            centerY = Math.floor(canvas_boundingBox.height / 2),
            deltaX = (centerX - clickX) / zoom,
            deltaY = (centerY - clickY) / zoom;

        if (zoom > 1) {
            x = x / zoom;
            y = y / zoom;
        }

        this.setState({
            x: x + 0,
            y: y + 0
        });

    }

    onMouseDown(e) {
        if (e.button === 2) {
            return false;
        }

        if (this.state.mode === modes.MODE_ZOOM) {

            this.invokeExternalEvent(this.props.willZoom, e);

            this.zoomPlus(!this.state.isAltOn);
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

    renderZoom() {
        const {zoom} = this.state,
            percent = Math.floor(100 * zoom);

        return <ZoomValueBox zoom={percent} show={true} />
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
                { this.renderZoom() }

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
    },
}