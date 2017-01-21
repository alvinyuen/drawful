
// room code generator
const genFourLetter = () => {
  let text = '';
  const range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 4; i += 1) {
    text += range.charAt(Math.floor(Math.random() * range.length));
  }
  return text;
};

const clients = [];

module.exports = (io) => {
/* client connection */
  io.sockets.on('connection', (socket) => {
    console.log(`** client has connected ${socket.id} - NAME - ${socket.playerName} **`);
    clients.push(socket);

    socket.on('disconnect', () => {
      console.log(`** client has disconnected ${socket.id} **`);
      const index = clients.findIndex(host => host.id === socket.id);
      const disClient = clients.splice(index, 1);
      if (disClient[0].playerName) {
        console.log(`[DISCONNECT]: ${disClient[0].playerName} disconnected from the game `);
      }
    });

    socket.on('host-room', () => {
      const index = clients.findIndex(host => host.id === socket.id);
      clients[index].isHost = true;
      const roomCode = genFourLetter();
      clients[index].roomCode = roomCode;
      clients[index].playerNum = 0;
      socket.join(roomCode);
      socket.emit('host-room-response', {
        roomCode: clients[index].roomCode,
      });
      console.log(`[${socket.id} - HOST]: TOTAL CLIENTS', ${clients.length}`);
      console.log(`[${socket.id} - HOST]: JOINED ROOM - ${roomCode}`);
    });

    socket.on('player-join', (payload) => {
      const index = clients.findIndex(host => host.id === socket.id);
      clients[index].isHost = false;
      clients[index].playerName = payload.playerName;
      // search through and see if there is host
      const hostIndex = clients.findIndex(host => host.roomCode === payload.roomCode.toUpperCase() && host.isHost);

      console.log(`[${socket.id}] - PLAYER: FINDING HOST - INDEX: ${hostIndex}, ROOMCODE: ${payload.roomCode.toUpperCase()}`);
      if (hostIndex >= 0) {
        // host found && join room
        socket.join(payload.roomCode);
        clients[hostIndex].playerNum += 1;
        console.log(`[${socket.id} - PLAYER]: ${payload.playerName} JOINED ROOM ${payload.roomCode}, TOTAL PLAYERS IN ROOM: ${clients[hostIndex].playerNum}`);
        socket.emit('player-join-response', {
          playerNum: clients[hostIndex].playerNum,
        });
      } else {
        socket.emit('player-join-response');
        console.log(`[${socket.id} - PLAYER]: NO ROOM WAS FOUND`);
      }
    });
  });
};







