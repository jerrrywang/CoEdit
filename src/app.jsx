import React from 'react';
import TextEditor from './components/textEditor/TextEditor';

export default class App extends React.Component {
  render() {
    const styles = {
      main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
    };
    return (
        <div style={styles.main}>
          <h2>Text editor!</h2>
          <TextEditor />
        </div>
    );
  }
}
