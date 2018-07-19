import React from 'react';
import Login from "./initial/Login";
import TextEditor from "./textEditor/TextEditor";
import Registration from "./initial/Registration";
import Home from "./home/Home";
import { Switch, Route } from 'react-router-dom';

const styles = {
    main: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
    }
};

class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/signup" component={Registration} />
                <Route path="/home" component={Home} />
                <Route path="/doc" component={TextEditor} />
            </Switch>
        );
    }
};

export default App;
