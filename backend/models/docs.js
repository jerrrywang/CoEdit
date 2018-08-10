import mongoose from 'mongoose';

const docSchema = mongoose.Schema({
    contentState: Object,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    title: String,
    dateCreated: Date,
    dateModified: Date,
    owner: String,
}, { minimize: false });

const Doc = mongoose.model('Doc', docSchema);

export default Doc;
