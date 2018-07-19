import mongoose from 'mongoose';
import Doc from './models/docs';

module.exports = (io) => {
    io.on('connection', client => {
        console.log('A user connected');
        client.on('disconnect', () => console.log('user disconnected'));
        client.on('createDoc', (id) => {
            const newDoc = new Doc({
                contentState: null,
                users: id
            });
            newDoc.save()
                .then(doc => client.emit('createdDoc', {id: doc._id}))
                .catch(err => console.log(err));
        });
        client.on('findDoc', id => {
            Doc.findById(id)
                .then(doc => client.emit('foundDoc', doc))
                .catch(err => console.log(err));
        });
        client.on('findAllDocs', () => {
            Doc.find()
                .then(docs => io.emit('foundAllDocs', docs))
                .catch(err => console.log(err));
        });
        client.on('liveContentState', rawContentState => {
            io.emit('liveContentStateFromServer', rawContentState);
        });
        client.on('saveContentState', (saveInfo, next) => {
            Doc.findByIdAndUpdate(saveInfo.docId, {
                contentState: saveInfo.rawContentState,
            })
                .then(next())
                .catch(err => console.log(err));
        });
    });
};
