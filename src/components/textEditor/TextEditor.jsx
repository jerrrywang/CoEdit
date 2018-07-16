import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  onChange(editorState) {
    this.setState({ editorState});
  }

  render() {
    return (<Editor editorState={this.state.editorState} onChange={(editorState) => this.onChange(editorState)}/>);
  }
}
