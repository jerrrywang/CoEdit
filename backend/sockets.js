module.exports = (io) => {
    io.on('connection', client => {
        console.log('a user connected');
        client.on('disconnect', function(){
            console.log('user disconnected');
        });
        client.on('contentState', contentState => {
            io.emit('contentStateFromServer', contentState);
        });
    });
};
