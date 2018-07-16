import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';

export default class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()};
        this.onChange = (editorState) => this.setState({editorState});
    }

    _onBoldClick(e) {
        e.preventDefault()
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
        };
        return (
            <div style = {styles.content}>
                <button onMouseDown={(e) => this._onBoldClick(e)}>BOLD</button>
                <div style = {styles.editor}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                    />
                </div>
        </div>);
    }
}
