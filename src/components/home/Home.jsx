import React from 'react';
import Header from '../app/Header';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DocsIcon from '@material-ui/icons/LibraryBooks'
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import openSocket from "socket.io-client";
const socket = openSocket('http://localhost:3000');

const styles = {
    div: {
        background: '#eee',
        height: '100vh'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        marginTop: 60
    },
    docsIcon: {
        marginRight: 15
    },
    title: {
        fontSize: 16
    },
    add: {
        position: 'absolute',
        bottom: 30,
        right: 30
    },
    editButton: {
        width: 40,
        height: 40,
        minWidth: 30,
        minHeight: 30,
        position: 'relative',
        left: 349,
        top: 10
    },
    deleteButton: {
        width: 40,
        height: 40,
        minWidth: 30,
        minHeight: 30,
    }
};

const matStyles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});
let user = null;
class Home extends React.Component {
    state = {
        docs: [],
        expanded: null
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
        socket.emit('createDoc', {
            id: user.id,
            username: user.username
        });
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
    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    deleteDoc = (id) => {
        socket.emit('deleteDoc', id, () => {
            this.setState({docs: this.state.docs.filter(doc => doc._id !== id)})
        });
    };

    render() {
        const { classes } = this.props;
        const { expanded } = this.state;
        return(
            <div style={styles.div}>
                <Header history={this.props.history} title='Docs'/>
                <div style={styles.container}>
                    <div style={styles.main}>
                        {this.state.docs.map(doc => (
                            <ExpansionPanel expanded={expanded === doc._id} onChange={this.handleChange(doc._id)}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <DocsIcon style={styles.docsIcon}/>
                                    <Typography style={styles.title} className={classes.heading}>
                                        {doc.title}
                                    </Typography>
                                    <Typography className={classes.secondaryHeading}>{`Author: ${doc.owner}`}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography>
                                        {`Created: ${(new Date(doc.dateCreated)).toDateString()}`}
                                    </Typography>
                                    <Typography>
                                        {`Last modified: ${(new Date(doc.dateModified)).toDateString()}`}
                                    </Typography>
                                    <Button style={styles.editButton}
                                            onClick={() => this.openDoc(doc)}><EditIcon /></Button>
                                    <Button style={styles.deleteButton}
                                            onClick={() => this.deleteDoc(doc._id)}><DeleteIcon /></Button>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        ))}
                    </div>
                </div>
                <Button variant="fab" color="primary" aria-label="Add" onClick={this.create} style={styles.add}>
                    <AddIcon />
                </Button>
            </div>
        )
    }
};

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(matStyles)(Home);