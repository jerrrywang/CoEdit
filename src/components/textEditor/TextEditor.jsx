import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils} from 'draft-js';
import { TwitterPicker } from 'react-color';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Icon from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import UnderlineIcon from '@material-ui/icons/FormatUnderlined';
import HighlightIcon from '@material-ui/icons/Highlight';
import TextColorIcon from '@material-ui/icons/FormatColorText';
import FontSizeIcon from '@material-ui/icons/FormatSize';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import CodeIcon from '@material-ui/icons/Code';
import OLIcon from '@material-ui/icons/FormatListNumbered';
import ULIcon from '@material-ui/icons/FormatListBulleted';


export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      fontRange: [
        8,
        9,
        10,
        11,
        12,
        14,
        18,
        24,
        30,
        36,
        48,
        60,
        72,
        96,
      ],
      fontSize: 11,
    };
    this.onChange = editorState => this.setState({ editorState });
  }

  _onTab = e => {
          const maxDepth = 4;
          this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
        }

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick = event => {
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalicsClick = event => {
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onUnderlineClick = event => {
    event.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  _onHighlightClick = event => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT'));
  }

  _onCodeClick = event => {
    event.preventDefault();
    this.onChange(RichUtils.toggleCode(this.state.editorState))
  }

  handleSizeChange = event => {
    this.setState({ fontSize: event.target.value });
  }

  _onOrderedList = event => {
    event.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'))
  }

  _onUnorderedList = event => {
    event.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'))
  }



  render() {
    const styles = {
      content: {
        flex: 1,
      },
      editor: {
        height: '500px',
        backgroundColor: 'white'
      },
    };

    const styleMap = {
      'HIGHLIGHT': {
    backgroundColor: 'lightgreen'
   }
 };
    const selection = this.state.editorState.getSelection();
    const blockType = this.state.editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

    return (<div style={styles.content}>
      <Toolbar>
      <Toolbar>
      <TextField
        select="select"
        className={'textField'}
        value={this.state.fontSize}
        onChange={this.handleSizeChange}
        InputProps={{
          startAdornment: <InputAdornment position="start" />,
        }}
      >
        {
          this.state.fontRange.map(option => (<MenuItem key={option} value={option}>
            {option}
          </MenuItem>))
        }
      </TextField>
      </Toolbar>
      <Toolbar>
      <IconButton onMouseDown={this._onBoldClick}>
        <BoldIcon />
      </IconButton>
      <IconButton onMouseDown={this._onItalicsClick}>
        <ItalicIcon />
      </IconButton>
      <IconButton onMouseDown={this._onUnderlineClick}>
        <UnderlineIcon />
      </IconButton>
      <IconButton onMouseDown={this._onCodeClick}>
        <CodeIcon />
      </IconButton>
      <IconButton onMouseDown={this._onHighlightClick}>
        <HighlightIcon />
      </IconButton>
      </Toolbar>
      <IconButton>
        <TextColorIcon />
      </IconButton>
      <TextField
        select="select"
        className={'textField'}
        value={this.state.fontSize}
        onChange={this.handleSizeChange}
        InputProps={{
          startAdornment: <InputAdornment position="start" />,
        }}>
        <MenuItem>
          <TwitterPicker />
        </MenuItem>
      </TextField>
      <Toolbar>
      <IconButton onMouseDown={this._onOrderedList}>
        <OLIcon />
      </IconButton>
      <IconButton onMouseDown={this._onUnorderedList}>
        <ULIcon />
      </IconButton>
      </Toolbar>
      </Toolbar>
      <div style={styles.editor} className="editor">
        <Editor  customStyleMap={styleMap} editorState={this.state.editorState} onChange={this.onChange} handleKeyCommand={this.handleKeyCommand} onTab={this._onTab}/>
      </div>
    </div>);
  }
}
