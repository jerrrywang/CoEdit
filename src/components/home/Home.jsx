import React from 'react';

class Home extends React.Component {
    componentDidMount() {
        this.props.passTitleToHeader('Home');
    }
    render() {
        return(
            <h1>Welcome {this.props.history.location.username}</h1>
        )
    }
};

export default Home;