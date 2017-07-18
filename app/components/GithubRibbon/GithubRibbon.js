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
            <div className="Github-container">
                <a target="_blank" href="https://github.com/dht/infinite-surface" className="stripe">
                    <div className="title">
                        Fok me on Github
                    </div>
                </a>
            </div>
        );
    }
}

const styles = {}

