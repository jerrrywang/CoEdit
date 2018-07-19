import React from 'react';
import Login from '../initial/Login';
import Registration from '../initial/Registration';
import Home from '../home/Home';
import TextEditor from "../textEditor/TextEditor";
import { Switch, Route } from 'react-router-dom';

class Main extends React.Component {
    render () {
        return (
                <Switch>
                    <Route path="/" component={Login} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Registration} />
                    <Route path="/home" component={Home} />
                    <Route path="/doc" component={TextEditor} />
                </Switch>
        )
    }
};

export default Main;