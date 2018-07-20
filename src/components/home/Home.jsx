import React from 'react';
import openSocket from "socket.io-client";
import Header from '../app/Header';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import DocsIcon from '@material-ui/icons/LibraryBooks'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
const socket = openSocket('http://localhost:3000');

const styles = {
    div: {
        background: '#eee',
        height: '100vh'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    container: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        background: '#fff',
        marginTop: 60
    },
    list: {
        maxWidth: '100%',
        width: 1130,
        minWidth: 670,
        paddingTop: 0,
        paddingBottom: 0
    },
    listItem: {
        height: 50,
        width: '100%',
    },
    title: {
        fontWeight: 500
    },
    add: {
        position: 'absolute',
        bottom: 30,
        right: 30
    }
};

const options = [
    'Rename',
    'Delete'
];
let user = null;

class Home extends React.Component {
    state = {
        docs: [],
        anchorEl: null
    };

    componentDidMount() {
        user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            socket.emit('findAllDocs', user.id);
            socket.on('foundAllDocs', docs => {
                this.setState({docs})
            });
        } else {
            this.props.history.push('/')
        }
    }
    create = () => {
        socket.emit('createDoc', user.id);
        socket.on('createdDoc', (res) => {
            this.props.history.push({
                pathname: '/doc',
                docId: res.id,
                newDoc: true
            })
        })
    };
    openDoc = (doc) => {
        this.props.history.push({
            pathname: '/doc',
            contentState: doc.contentState,
            docId: doc._id,
            id: user.id
        });
    };
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    handleMenu = (option, id) => {
        option === 'Delete' ? this.deleteDoc(id) : null
    };
    deleteDoc = (id) => {
        socket.emit('deleteDoc', id, () => {
            this.setState({docs: this.state.docs.filter(doc => doc._id !== id)})
        });
    };

    render() {
        return(
            <div style={styles.div}>
                <Header history={this.props.history} title='Docs'/>
                <div style={styles.main}>
                    <div style={styles.container}>
                        <List component="nav" style={styles.list}>
                            {this.state.docs.map(doc => (
                                <div key={doc._id}>
                                    <ListItem button style={styles.listItem}>
                                        <DocsIcon />
                                        <ListItemText style={styles.title} primary={doc._id} onClick={() => this.openDoc(doc)} />
                                        <div>
                                            <IconButton
                                                aria-label="More"
                                                aria-owns={this.state.anchorEl ? 'long-menu' : null}
                                                aria-haspopup="true"
                                                onClick={this.handleClick}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={this.state.anchorEl}
                                                open={Boolean(this.state.anchorEl)}
                                                onClose={this.handleClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: 48 * 4.5,
                                                        width: 200,
                                                    },
                                                }}
                                            >
                                                {options.map(option =>
                                                    <MenuItem key={option} onClick={() => this.handleMenu(option, doc._id)}>
                                                        {option}
                                                    </MenuItem>
                                                )}
                                            </Menu>
                                        </div>
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                        </List>
                    </div>
                </div>
                <Button variant="fab" color="primary" aria-label="Add" onClick={this.create} style={styles.add}>
                    <AddIcon />
                </Button>
            </div>
        )
    }
};

export default Home;