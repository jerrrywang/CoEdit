import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
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
        display: 'flex',
        flexDirection: 'row'
    }
};

class Registration extends React.Component {
    state = {
        username: '',
        password: ''
    };
    componentDidMount() {
        this.props.passTitleToHeader("Registration");
    }
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
            .then(json => console.log(json))
            .catch(err => console.log(err))
    };

    render() {
        const { classes } = this.props;
        return (
            <Card style={styles.card}>
                <CardContent>
                    <Typography style={styles.header} variant="headline" component="h1">
                        Create your Account
                    </Typography>
                    <form className = {classes.container}
                          style={styles.form}>
                        <TextField type = 'text'
                                   label = 'Username'
                                   name = 'username'
                                   className={classes.textField}
                                   margin="normal"
                                   value = {this.state.username}
                                   onChange = {(e) => this.handleUsernameChange(e)}
                                   style={styles.input}
                        />
                        <TextField type = 'text'
                                   label = 'Password'
                                   name = 'password'
                                   className={classes.textField}
                                   type="password"
                                   margin="normal"
                                   value = {this.state.password}
                                   onChange = {(e) => this.handlePasswordChange(e)}
                                   style={styles.input}
                        />
                        <CardActions style={styles.actions}>
                            <Button color="primary"
                                    className={classes.button}>
                                Login Instead
                            </Button>
                            <Button variant="contained"
                                    aria-label="Registration"
                                    onClick={(e) => this.handleSubmit(e)}
                                    className={classes.button}
                                    color="primary"
                            >
                                Register
                            </Button>
                        </CardActions>
                    </form>
                </CardContent>
            </Card>
        )
    }
}

Registration.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Registration);