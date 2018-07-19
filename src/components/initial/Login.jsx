import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
};

class Login extends React.Component {
    state = {
        username: '',
        password: ''
    };
    componentDidMount() {
        this.props.passTitleToHeader("Login");
    }
    handleUsernameChange = e => {
        this.setState({username: e.target.value})
    };
    handlePasswordChange = e => {
        this.setState({password: e.target.value})
    };
    handleSubmit = e => {
        e.preventDefault();
        fetch('http://localhost:3000/login', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(result => {
                console.log("result:", result);
                return result.json()
            })
            .then(json => {
                console.log(json);
                json.success ?
                    this.props.history.push({
                        pathname: '/home',
                        username: json.userDetails.username,
                        id: json.userDetails.id})
                :
                    this.props.history.push('/login')
            })
            .catch(err => console.log(err))
    };

    render() {
        const { classes } = this.props;
        return (
            <form className = {classes.container}>
                <TextField type = 'text'
                           label = 'Username'
                           name = 'username'
                           className={classes.textField}
                           margin="normal"
                           value = {this.state.username}
                           onChange = {(e) => this.handleUsernameChange(e)}
                />
                <TextField type = 'text'
                           label = 'Password'
                           name = 'password'
                           className={classes.textField}
                           type="password"
                           margin="normal"
                           value = {this.state.password}
                           onChange = {(e) => this.handlePasswordChange(e)}
                />
                <Button variant="extendedFab"
                        aria-label="Login"
                        onClick={(e) => this.handleSubmit(e)}
                >
                    Login!
                </Button>
            </form>

        )
    }
}

export default withStyles(styles)(Login);