import React from 'react';
import Header from './app/Header';
import Main from './app/Main';

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
    }
};

class App extends React.Component {
    state = {
        title: ''
    };

    passTitleToHeader = (title) => {
        this.setState({ title: title })
    };

    render() {
        return (
            <div>
                <Header history={this.props.history} title={this.state.title}/>
                <div style={styles.main}>
                    <Main history={this.props.history} passTitleToHeader={this.passTitleToHeader}/>
                </div>
            </div>
        )
    }
};

export default App;
