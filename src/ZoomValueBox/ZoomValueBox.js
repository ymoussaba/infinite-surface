import React from 'react';

export default class ZoomValueBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            zoom: props.zoom
        }
    }

    componentWillReceiveProps(newProps) {
        const {zoom} = newProps;

        if (zoom!==this.state.zoom) {
            this.setState({zoom: zoom, show: true});

            clearTimeout(this.timeout);

            this.timeout = setTimeout(() => {
                this.setState({show: false});
            }, 1000)
        }
    }

    render() {
        const {zoom, show} = this.state;

        return (<div style={{...styles.zoom, opacity: show ? 0.8 : 0}}>
                {zoom}%
            </div>);
    }
}

const styles = {
    zoom: {
        position:'fixed',
        opacity:0.8,
        fontSize:'50px',
        bottom:50,
        left:'50%',
        width:'150px',
        marginLeft:'-75px',
        transition:'opacity 0.3s linear',
        height:'60px',
        textAlign:'center',
        color:'rgba(100,100,100,0.9)',
        zIndex:1999,
        textShadow:'1px 1px 0 rgba(50,50,50,1.0)',
        pointerEvents:'none',

    }
}

