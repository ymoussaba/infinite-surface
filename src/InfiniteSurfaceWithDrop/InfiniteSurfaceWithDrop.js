import React from 'react';
import Dropzone from 'react-dropzone';
import InfiniteSurface from '../InfiniteSurface';

export default class InfiniteSurfaceWithDrop extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            accept: '',
            files: [],
            dropzoneActive: false,
        }

        this.invokeExternalEvent = this.invokeExternalEvent.bind(this);

        this.findTarget = this.findTarget.bind(this);
        this.parseFiles = this.parseFiles.bind(this);
    }

    invokeExternalEvent(event) {
        if (event) {
            event.call(this);
        }
    }

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    findTarget(ev) {
        let target = ev.target,
            run = 0,
            id;

        while (run < 10 && !id) {
            id = target.getAttribute('id');
            target = target.parentNode ? target.parentNode : target;
            run++;
        }

        return id;
    }

    parseFiles(files) {
        return files.map(file => {
            return {
                lastModified: file.lastModified,
                name: file.name,
                preview: file.preview,
                type: file.type,
                size: file.size,
            }
        });
    }

    onDrop(files, rejectedFiles, ev) {

        const target = this.findTarget(ev),
            isCanvas = target === 'main-canvas';

        if (files && files.length > 0) {
            this.props.imageDrop({
                target,
                isCanvas,
                files: this.parseFiles(files)
            });
        }

        this.setState({
            dropzoneActive: false
        });
    }

    render() {
        const {accept} = this.state;

        return (
            <Dropzone
                id="main-dropzone"
                disableClick
                accept={accept}
                onDrop={this.onDrop.bind(this)}
                onDragEnter={this.onDragEnter.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
                style={styles.container}>
                <InfiniteSurface {...this.props}>
                    {this.props.children}
                </InfiniteSurface>
            </Dropzone>

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
}