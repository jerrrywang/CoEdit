import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import App from './app';

class Routes extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )
    }
}