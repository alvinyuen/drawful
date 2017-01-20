const { io } = require('../');

io.on('connection', (socket) => {
    console.log(`A new client has connected %s`, socket.id);

    socket.on('disconnected', () => {
        console.log(`client has disconnected %s`,socket.id);
    })

})