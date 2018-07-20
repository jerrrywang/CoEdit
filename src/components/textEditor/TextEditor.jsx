import React from 'react';
import ReactDOM from 'react-dom';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import io from 'socket.io-client';
const socket = io('http://localhost:3000');
import SystemFonts from 'system-font-families';
const systemFonts = new SystemFonts();
const fontList = systemFonts.getFontsSync();
import Typography from '@material-ui/core/Typography';
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
import SaveIcon from '@material-ui/icons/Save';
import DocIcon from '@material-ui/icons/Description'

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

//THIS FUNCTION WOULD BE A NECESSARY METHOD IF WE RENDERED ALL BUTTONS IN ONE MAP
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
      fontArray: fontList.slice(9),
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
      fontType: 'Roboto',
      docTitle: 'New Doc',
      anchorEl: null,
      anchorEl2: null
    };
  }

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

  onChange = (editorState) => {
    socket.emit('liveContentState', {
      id: this.props.history.location.docId,
      rawContentState: convertToRaw(editorState.getCurrentContent())
    });
    this.setState({editorState});
  };

  onSave = () => {
    socket.emit('saveContentState', {
      rawContentState: convertToRaw(this.state.editorState.getCurrentContent()),
      docId: this.props.history.location.docId
    }, () => console.log("Saved!"))
  };

  onInlineChange = (e, style) => {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style))
  };

  onBlockChange = (e, style) => {
    e.preventDefault()
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, style))
  };

  onTab = e => {
    e.preventDefault();
    const tabCharacter = '     ';
    let newState = Modifier.replaceText(this.state.editorState.getCurrentContent(), this.state.editorState.getSelection(), tabCharacter);

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

  toggleFont(e, font) {
    e.preventDefault();
    if (!customStyleMap[font]) {
      customStyleMap[font] = {
        fontFamily: this.state.fontArray[font]
      }
    }
    this.setState({fontType: font})
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, font));
  }

  onFontColorChange = color => {
    console.log(color)
      customStyleMap[color.hex] = {
        color: color.hex
      }
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, color.hex))
    this.handleColorClose();
  }

  onHighlightColorChange = color => {
      customStyleMap[color.hex] = {
        backgroundColor: color.hex
      }
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, color.hex))
    this.handleHighlightClose();
  }

  handleColorClick = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleHighlightClick = event => {
    this.setState({anchorEl2: event.currentTarget});
  };

  handleColorClose = () => {
    this.setState({anchorEl: null});
  };

  handleHighlightClose = () => {
    this.setState({anchorEl2: null});
  };

  render() {
    const {anchorEl} = this.state;
    const {anchorEl2} = this.state;
    return (<div>
      <div className='document-header' style={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
      <IconButton style={{margin: 10}} onClick={this.props.history.goBack}><DocIcon/></IconButton>
      <TextField style={{
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 300
        }} defaultValue={this.state.docTitle} onInput={e => this.handleTitleChange(e)} placeholder='Untitled Document' InputProps={{
          style: {
            fontSize: 30,
            fontWeight: 'bold'
          }
        }}/>
      </div>
      <div>
        <Toolbar className='document-toolbar'>
          <Toolbar className='document-toolbar-group'>
            <TextField select style={{
                paddingRight: 15
              }} value={this.state.fontType} placeholder='Roboto' onChange={e => this.toggleFont(e, e.target.value)}>
              {
                this.state.fontArray.map((font, i) => (<MenuItem key={font} value={i}>
                  {font}
                </MenuItem>))
              }
            </TextField>

            <TextField select value={this.state.fontSize} onChange={e => this.toggleFontSize(e, e.target.value)}>
              {
                this.state.fontRange.map((fontSize, i) => (<MenuItem key={fontSize} value={fontSize}>
                  {fontSize}
                </MenuItem>))
              }
            </TextField>
          </Toolbar>
          <Toolbar className='document-toolbar-group'>
            {
              TOOLBAR_1.map((button) => <IconButton onMouseDown={(e) => this.onInlineChange(e, button.style)} key={button.style} style={{
                  backgroundColor: this.state.editorState.getCurrentInlineStyle().has(button.style)
                    ? '#E8E8E8'
                    : '#FFFFFF'
                }}>
                <button.label/>
              </IconButton>)
            }
            <div>

              <IconButton aria-owns={anchorEl
                  ? 'fontColor-menu'
                  : null} aria-haspopup="true" onClick={this.handleColorClick}>
                <TextColorIcon/>
              </IconButton>

              <Menu select="select" id="fontColor-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleColorClose}>
                <TwitterPicker onChangeComplete={this.onFontColorChange}/>
              </Menu>

            </div>
            <div>

              <IconButton aria-owns={anchorEl2
                  ? 'highlightColor-menu'
                  : null} aria-haspopup="true" onClick={this.handleHighlightClick}>
                <HighlightIcon/>
              </IconButton>
              <Menu select="select" id="highlightColor-menu" anchorEl={anchorEl2} open={Boolean(anchorEl2)} onClose={this.handleHighlightClose}>
                <TwitterPicker onChangeComplete={this.onHighlightColorChange}/>
              </Menu>
            </div>

          </Toolbar>
          <Toolbar className='document-toolbar-group'>
            {
              TOOLBAR_2.map((button) => <IconButton onMouseDown={(e) => this.onBlockChange(e, button.style)} key={button.style} style={{
                  backgroundColor: this.state.editorState.getCurrentInlineStyle().has(button.style)
                    ? '#E8E8E8'
                    : '#FFFFFF'
                }}>
                <button.label/>
              </IconButton>)
            }
          </Toolbar>
          <Toolbar>
            {
              TOOLBAR_3.map((button) => <IconButton onMouseDown={(e) => this.onBlockChange(e, button.style)} key={button.style} style={{
                  backgroundColor: this.state.editorState.getCurrentInlineStyle().has(button.style)
                    ? '#E8E8E8'
                    : '#FFFFFF'
                }}>
                <button.label/>
              </IconButton>)
            }
            <IconButton onClick={this.onSave}><SaveIcon /></IconButton>
          </Toolbar>
        </Toolbar>
        <div className="editor">
          <Editor customStyleMap={customStyleMap} editorState={this.state.editorState} onChange={this.onChange} handleKeyCommand={this.handleKeyCommand} onTab={this.onTab} blockStyleFn={getBlockStyle}/>
        </div>
      </div>
    </div>);
  }
}
