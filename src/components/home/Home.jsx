import React from 'react';
import openSocket from "socket.io-client";
import Header from '../app/Header';
const socket = openSocket('http://localhost:3000');

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
                {this.state.docs.map(doc => (
                    <div key={doc._id}>
                        {doc._id}
                        <button onClick={() => this.openDoc(doc)}>Edit</button>
                        <button onClick={() => this.deleteDoc(doc._id)}>Delete</button>
                    </div>
                ))}
                <button onClick={this.create}>Create new doc</button>
            </div>
        )
    }
};

export default Home;