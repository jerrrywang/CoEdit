import React from 'react';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');
import {Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    convertFromRaw} from 'draft-js';

export default class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
    }

    componentDidMount() {
        socket.on('contentStateFromServer', rawContentState => {
            const newEditorState = EditorState.createWithContent(convertFromRaw(rawContentState));
            const currentSelection = this.state.editorState.getSelection();
            this.setState({
                editorState: EditorState.forceSelection(newEditorState, currentSelection)
            });
        });
    };

    onChange = (editorState) => {
        const rawData = convertToRaw(editorState.getCurrentContent());
        console.log("to send to server:", editorState);
        socket.emit('contentState', rawData);
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
                <h2>Text editor!</h2>
                <div style = {styles.content}>
                    <button onMouseDown={(e) => this.onBoldClick(e)}>BOLD</button>
                    <div style = {styles.editor}>
                        <Editor
                            editorState={this.state.editorState}
                            onChange={this.onChange}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
