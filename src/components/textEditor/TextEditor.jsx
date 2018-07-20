import React from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3000');
import {Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw} from 'draft-js';

export default class TextEditor extends React.Component {
    state = {
        editorState: EditorState.createEmpty()
    };

    componentDidMount() {
        socket.emit('room', this.props.history.location.docId);
        if (!this.props.history.location.newDoc) {
            socket.on('foundDoc', res => {
                const newEditorState = EditorState.createWithContent(convertFromRaw(res.contentState));
                const currentSelection = this.state.editorState.getSelection();
                this.setState({
                    editorState: EditorState.forceSelection(newEditorState, currentSelection)
                });
            });
        }
        socket.on('liveContentStateFromServer', rawContentState => {
            const newEditorState = EditorState.createWithContent(convertFromRaw(rawContentState));
            const currentSelection = this.state.editorState.getSelection();
            this.setState({
                editorState: EditorState.forceSelection(newEditorState, currentSelection)
            });
        });
    };

    componentWillUnmount() {
        socket.emit('closeDoc', this.props.location.docId, () => console.log("Closed!"));
    }

    onSave = () => {
        socket.emit('saveContentState', {
            rawContentState: convertToRaw(this.state.editorState.getCurrentContent()),
            docId: this.props.history.location.docId
        }, () => console.log("Saved!"))
    };

    onChange = (editorState) => {
        socket.emit('liveContentState', {
            id: this.props.history.location.docId,
            rawContentState: convertToRaw(editorState.getCurrentContent())
        });
        this.setState({editorState});
    };

    onBoldClick(e) {
        e.preventDefault();
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    render() {
        const styles = {
            content: {
                width: 480,
                margin: 'auto',
            },
            editor: {
                border: '1px solid black',
                height: 200
            },
            container: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }
        };

        return (
            <div style = {styles.container}>
                <button onClick={this.props.history.goBack}>Back</button>
                <h2>Document {this.props.history.location.docId} </h2>
                <div style = {styles.content}>
                    <button onMouseDown={(e) => this.onBoldClick(e)}>BOLD</button>
                    <div style = {styles.editor}>
                        <Editor
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                        />
                    </div>
                    <button onClick={this.onSave}>Save</button>
                </div>
            </div>
        );
    }
}
