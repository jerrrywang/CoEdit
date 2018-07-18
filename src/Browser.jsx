import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import App from './components/App';

class Browser extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )
    }
}

export default Browser;