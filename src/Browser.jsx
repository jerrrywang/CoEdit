import { HashRouter } from 'react-router-dom';
import React from 'react';
import App from './components/App';

class Browser extends React.Component {
    render() {
        return (
            <HashRouter>
                <App />
            </HashRouter>
        );
    }
}

export default Browser;