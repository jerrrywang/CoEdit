import React, { Component } from 'react';
import { Button } from '@material-ui/core/Button';
import DocumentEditor from './components/textEditor/TextEditor';



export default class App extends Component {
  render() {
    return (<div>
          <DocumentEditor />
        </div>
    );
  }
}
