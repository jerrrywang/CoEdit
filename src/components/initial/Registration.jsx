import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        minWidth: 500,
        maxWidth: 750,
        height: 562,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
       fontSize: 24
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    input: {
        width: 350,
        marginTop: 30
    },
    actions: {
      marginTop: 50,
      display: 'block',
      flexDirection: 'row',
      textAlign: 'right'
    }
};

class Registration extends React.Component {
    state = {
        username: '',
        password: ''
    };

    handleUsernameChange = e => {
        this.setState({username: e.target.value})
    };
    handlePasswordChange = e => {
        this.setState({password: e.target.value})
    };
    handleSubmit = e => {
        e.preventDefault();
        fetch('http://localhost:3000/registration', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        })
            .then(result => result.json())
            .then(this.props.history.push('/'))
            .catch(err => console.log(err))
    };

    handleGoBack = e => {
      e.preventDefault()
      this.props.history.push('/')
    };

    render() {
        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <CardContent>
                        <Typography style={styles.header} variant="headline" component="h1">
                            Create your account
                        </Typography>
                        <form style={styles.form}>
                            <TextField type = 'text'
                                       label = 'Username'
                                       name = 'username'
                                       margin="normal"
                                       value = {this.state.username}
                                       onChange = {(e) => this.handleUsernameChange(e)}
                                       style={styles.input}
                            />
                            <TextField type = 'text'
                                       label = 'Password'
                                       name = 'password'
                                       type="password"
                                       margin="normal"
                                       value = {this.state.password}
                                       onChange = {(e) => this.handlePasswordChange(e)}
                                       style={styles.input}
                            />
                            <CardActions style={styles.actions}>
                                <Button
                                  color="primary"
                                  onClick={this.handleGoBack}
                                  >
                                    Login instead
                                </Button>
                                <Button variant="contained"
                                        aria-label="Login"
                                        onClick={(e) => this.handleSubmit(e)}
                                        color="primary"
                                >
                                    Create
                                </Button>
                            </CardActions>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Registration;
