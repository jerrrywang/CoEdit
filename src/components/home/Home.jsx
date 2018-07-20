import React from 'react';
import openSocket from "socket.io-client";
import Header from '../app/Header';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Radium from 'radium';
const socket = openSocket('http://localhost:3000');

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        background: '#eee'
    },
    list: {
        maxWidth: 1130,
        width: 1130,
        minWidth: 670
    },
    listItem: {
        height: 50,
        width: '100%'
    }
};

class Home extends React.Component {
    state = {
        docs: []
    };

    componentDidMount() {
        socket.emit('findAllDocs', this.props.history.location.id);
        socket.on('foundAllDocs', docs => {
            this.setState({docs})
        });
    }
    create = () => {
        socket.emit('createDoc', this.props.history.location.id);
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
            docId: doc._id
        });
    };

    deleteDoc = (id) => {
        socket.emit('deleteDoc', id, () => {
            this.setState({docs: this.state.docs.filter(doc => doc._id !== id)})
        });
    };

    render() {
        return(
            <div>
                <Header title='Docs'/>
                <h1>Welcome {this.props.history.location.username}</h1>
                <div style={styles.container}>
                    <List component="nav" style={styles.list}>
                        {this.state.docs.map(doc => (
                            <div key={doc._id}>
                                <ListItem button style={styles.listItem} onClick={() => this.openDoc(doc)}>
                                    <ListItemText primary={doc._id} />
                                    <button onClick={() => this.deleteDoc(doc._id)}>Delete</button>
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>
                </div>
                <button onClick={this.create}>Create new doc</button>
            </div>
        )
    }
};

export default Radium(Home);