import mongoose from 'mongoose';
import Doc from './models/docs';

module.exports = (io) => {
    io.on('connection', client => {
        console.log('A user connected');
        client.on('disconnect', () => console.log('user disconnected'));
        client.on('room', id => {
            client.join(id);
        });
        client.on('createDoc', id => {
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
                .then(docs => client.emit('foundAllDocs', docs))
                .catch(err => console.log(err));
        });
        client.on('deleteDoc', (id, next) => {
            Doc.deleteOne({ _id: id })
                .then(next())
                .catch(err => console.log(err));
        });
        client.on('liveContentState', data => {
            io.to(data.id).emit('liveContentStateFromServer', data.rawContentState);
        });
        client.on('saveContentState', (saveInfo, next) => {
            Doc.findByIdAndUpdate(saveInfo.docId, {
                contentState: saveInfo.rawContentState,
            })
                .then(next())
                .catch(err => console.log(err));
        });
        client.on('closeDoc', (id, next) => {
            client.leave(id);
            next();
        });
    });
};
