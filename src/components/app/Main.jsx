import React from 'react';
import Login from '../initial/Login';
import Registration from '../initial/Registration';
import Home from '../home/Home';
import TextEditor from "../textEditor/TextEditor";
import { Switch, Route } from 'react-router-dom';

class Main extends React.Component {
    render () {
        return (
            <main>
                <Switch>
                    <Route path="/login"
                           render={(props) =>
                               (<Login {...props} passTitleToHeader = {this.props.passTitleToHeader} />)
                           }
                    />
                    <Route path="/signup"
                           render={(props) => (
                               <Registration {...props} passTitleToHeader = {this.props.passTitleToHeader}/>
                           )}
                    />
                    <Route path="/home"
                           render={(props) => (
                               <Home {...props} passTitleToHeader = {this.props.passTitleToHeader}/>
                           )}
                    />
                    <Route path="/doc"
                           component={TextEditor}
                    />
                </Switch>
            </main>
        )
    }
};

export default Main;