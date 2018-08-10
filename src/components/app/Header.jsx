import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Description';
import Popover from '@material-ui/core/Popover';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';


const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    homeButton: {
        marginRight: 20,
    },
    logout: {
        fontSize: '1rem',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15
    }
};

class Header extends React.Component {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    onLogout = () => {
        fetch('http://localhost:3000/logout', {
            credentials: 'same-origin'
        })
            .then(() => {
                localStorage.removeItem('user');
                this.props.history.push('/')
            })
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <HomeIcon style={styles.homeButton}/>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {this.props.title}
                        </Typography>
                        <div>
                            <IconButton
                                onClick={this.handleClick}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Popover
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                onClose={this.handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <Typography style={styles.logout}
                                            onClick={this.onLogout}>
                                    Logout
                                </Typography>
                            </Popover>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};

export default withStyles(styles)(Header);