import React from 'react';
import openSocket from "socket.io-client";
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
        this.props.passTitleToHeader('Home');
        console.log(this.props.history);
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
    render() {
        return(
            <div>
                <h1>Welcome {this.props.history.location.username}</h1>
                {this.state.docs.map(doc => (
                    <div key={doc._id}>
                        {doc._id}
                        <button onClick={() => this.openDoc(doc)}>Edit</button>
                    </div>
                ))}
                <button onClick={this.create}>Create new doc</button>
            </div>
        )
    }
};

export default Home;