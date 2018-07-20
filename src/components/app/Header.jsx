import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Description'
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
};

class Header extends React.Component {
    state = {
        anchorEl: null
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    onLogout = () => {
        fetch('http://localhost:3000/logout', {
            credentials: 'same-origin'
        })
            .then((res) => {
                localStorage.removeItem('user');
                this.props.history.push('/')
            })
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

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
                                aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <Link to='/signup'>
                                    <MenuItem>Signup</MenuItem>
                                </Link>
                                <Link to='/'>
                                    <MenuItem>Login</MenuItem>
                                </Link>
                                <Link to='/home'>
                                    <MenuItem>My Documents</MenuItem>
                                </Link>
                                <MenuItem onClick={this.onLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};

export default withStyles(styles)(Header);