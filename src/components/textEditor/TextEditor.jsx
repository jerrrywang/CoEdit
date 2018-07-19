import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import {TwitterPicker} from 'react-color';
import Fade from '@material-ui/core/Fade';
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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import CodeIcon from '@material-ui/icons/Code';
import OLIcon from '@material-ui/icons/FormatListNumbered';
import ULIcon from '@material-ui/icons/FormatListBulleted';
import TextLeftIcon from '@material-ui/icons/FormatAlignLeft';
import TextRightIcon from '@material-ui/icons/FormatAlignRight';
import TextCenterIcon from '@material-ui/icons/FormatAlignCenter';
import JustifyIcon from '@material-ui/icons/FormatAlignJustify';

const customStyleMap = {
  remoteCursor: {
    borderLeft: 'solid 3px lightGrey'
  },
  'HIGHLIGHT': {
    backgroundColor: 'lightgreen'
  },
  'COLOR': {
    color: 'red'
  }

}

function isBlockStyle(style) {
  if (style.indexOf('text-align-') === 0)
    return true
  return false
}

function getBlockStyle(block) {
  const type = block.getType()
  return isBlockStyle(type)
    ? type
    : null
}

//THIS FUNCTION WOULD BE A NECESSARY METHOD IF WE RENDERED ALL BUTTON IN ONE MAP
// onStyleChange = (style) => (e) => {
//    e.preventDefault()
//    const toggleFn = isInline(style) ? RichUtils.toggleInlineStyle : RichUtils.toggleBlockType;
//    this.onChange(toggleFn(this.state.editorState, style))
//  };

const TOOLBAR_1 = [
  {
    label: BoldIcon,
    style: 'BOLD'
  }, {
    label: ItalicIcon,
    style: 'ITALIC'
  }, {
    label: UnderlineIcon,
    style: 'UNDERLINE'
  }, {
    label: CodeIcon,
    style: 'CODE'
  }
]

const TOOLBAR_2 = [
  {
    label: TextLeftIcon,
    style: 'text-align-left'
  }, {
    label: TextCenterIcon,
    style: 'text-align-center'
  }, {
    label: TextRightIcon,
    style: 'text-align-right'
  }, {
    label: JustifyIcon,
    style: 'text-align-justify'
  }
]

const TOOLBAR_3 = [
  {
    label: OLIcon,
    style: 'ordered-list-item'
  }, {
    label: ULIcon,
    style: 'unordered-list-item'
  }
]

export default class DocumentEditor extends React.Component {
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
        96
      ],
      fontSize: 14,
      docTitle: 'New Doc',
      anchorEl: null,
    };
    this.onChange = editorState => this.setState({editorState});
  }

  onInlineChange = (style) => (e) => {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style))
  };

  onBlockChange = (style) => (e) => {
    e.preventDefault()
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, style))
  };

  onTab = e => {
    e.preventDefault();
    const tabCharacter = '     ';
    let newState = Modifier.replaceText(
      this.state.editorState.getCurrentContent(),
      this.state.editorState.getSelection(),
      tabCharacter
    );

    this.setState({
      editorState: EditorState.push(this.state.editorState, newState, 'insert-characters')
    });
  }

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleTitleChange = event => {
    this.setState({docTitle: event.target.value})
  }

  toggleFontSize(e, fontSize) {
    e.preventDefault();
    if (!customStyleMap[fontSize]) {
      customStyleMap[fontSize] = {
        fontSize: fontSize
      }
    }
    this.setState({fontSize: fontSize})
    return this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, fontSize));
  }

  onFontColorChange = color => {
    console.log(color)
    customStyleMap['COLOR'] =
    {
      color: color.hex
    }
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'COLOR'))
    this.handleClose();
  }

  onHighlightColorChange = color => {
    console.log(color)
    customStyleMap['HIGHLIGHT'] =
    {
      backgroundColor: color.hex
    }
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'HIGHLIGHT'))
    this.handleClose();
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    return (<div className='document-header'>
      <TextField style={{
          paddingLeft: 30,
          paddingTop: 20,
          paddingRight: 300
        }} defaultValue={this.state.docTitle} onChange={e => this.handleTitleChange(e)} InputProps={{
          style: {
            fontSize: 30,
            fontWeight: 'bold'
          }
        }}/>
      <div >
        <Toolbar className='document-toolbar'>
          <Toolbar className='document-toolbar-group-first'>

            <TextField select value={this.state.fontSize} onChange={e => this.toggleFontSize(e, e.target.value)}>
              {
                this.state.fontRange.map(fontSize => (<MenuItem key={fontSize} value={fontSize}>
                  {fontSize}
                </MenuItem>))
              }
            </TextField>
          </Toolbar>
          <Toolbar className='document-toolbar-group'>
            {
              TOOLBAR_1.map((button) => <IconButton onMouseDown={this.onInlineChange(button.style)} key={button.style}>
                <button.label/>
              </IconButton>)
            }
            <div>

              <IconButton
                aria-owns={anchorEl ? 'fontColor-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <TextColorIcon />
              </IconButton>

              <Menu
                select="select"
                id="fontColor-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}

              >
              <TwitterPicker onChangeComplete={ this.onFontColorChange }/>
              </Menu>

            </div>
            <div>

              <IconButton
                aria-owns={anchorEl ? 'highlightColor-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <HighlightIcon />
              </IconButton>
              <Menu
                select="select"
                id="highlightColor-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
              <TwitterPicker onChangeComplete={ this.onHighlightColorChange }/>
              </Menu>
            </div>

          </Toolbar>
          <Toolbar>
            {
              TOOLBAR_2.map((button) => <IconButton onMouseDown={this.onBlockChange(button.style)} key={button.style}>
                <button.label/>
              </IconButton>)
            }
          </Toolbar>
          <Toolbar>
            {
              TOOLBAR_3.map((button) => <IconButton onMouseDown={this.onBlockChange(button.style)} key={button.style}>
                <button.label/>
              </IconButton>)
            }
          </Toolbar>
        </Toolbar>
        <div className="editor">
          <Editor customStyleMap={customStyleMap} editorState={this.state.editorState} onChange={this.onChange} handleKeyCommand={this.handleKeyCommand} onTab={this.onTab} blockStyleFn={getBlockStyle}/>
        </div>
      </div>
    </div>);
  }
}
