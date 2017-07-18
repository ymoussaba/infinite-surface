import React from 'react';
import './GithubRibbon.scss';

export default class Github extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentWillReceiveProps(newProps) {
    }

    componentDidMount() {
    }


    render() {
        const {} = this.state;

        return (
            <a target="_blank" href="https://github.com/dht/movable-canvas" className="Github-container">
                <div className="stripe">
                    <div className="title">
                        Fok me on Github
                    </div>
                </div>
            </a>
        );
    }
}

const styles = {}

