import React from 'react';
import { Button } from '@material-ui/core/Button';
import TextEditor from './components/textEditor/TextEditor';



export default class App extends React.Component {
  render() {
    const styles = {
      main: {
        fontFamily: 'Roboto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
    return (
        <div style={styles.main}>
          <h1>Draft.js Editor</h1>
          <TextEditor />
        </div>
    );
  }
}
