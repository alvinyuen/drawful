

// room code generator
const genFourLetter = () => {
  let text = '';
  const range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 1; i += 1) {
    text += range.charAt(Math.floor(Math.random() * range.length));
  }
  return text;
};

// random Number
const genRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


const wordList = ['Hot Pocket', 'vikings', 'thermonuclear detonation', 'invading poland', 'crumbs all over the carpet', 'the underground railroad', 'an ugly face', 'land mines', 'auschwitz', 'the big bang'];

const clients = [];

const findClient = (socket) => {
  const index = clients.findIndex(client => client.id === socket.id);
  return clients[index];
};

const findHost = (roomCode) => {
  const index = clients.findIndex(host => host.roomCode === roomCode && host.isHost);
  return clients[index];
};

const findPlayers = roomCode =>
clients.filter(host => host.roomCode === roomCode && host.isHost === false);



module.exports = (io) => {
/* client connection */
  io.sockets.on('connection', (socket) => {
    // console.log(`** client has connected ${socket.id} - NAME - ${socket.playerName} **`);
    clients.push(socket);

    socket.on('disconnect', () => {
      // console.log(`** client has disconnected ${socket.id} **`);
      const index = clients.findIndex(host => host.id === socket.id);
      const disClient = clients.splice(index, 1);
      if (disClient[0].playerName) {
        console.log(`[DISCONNECT]: ${disClient[0].playerName} disconnected from the game `);
      }
    });

    /* host room */
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

    /* player join room */
    socket.on('player-join', (payload) => {
      const index = clients.findIndex(host => host.id === socket.id);
      clients[index].isHost = false;
      clients[index].playerName = payload.playerName;
      // search through and see if there is host
      const hostIndex = clients.findIndex(host =>
      host.roomCode === payload.roomCode.toUpperCase() && host.isHost);

      // console.log(`[${socket.id}] - PLAYER: FINDING HOST - INDEX: ${hostIndex}, ROOMCODE: ${payload.roomCode.toUpperCase()}`);
      if (hostIndex >= 0) {
        // host found && join room
        socket.join(payload.roomCode);
        clients[index].roomCode = payload.roomCode.toUpperCase();
        const playerNum = clients[hostIndex].playerNum += 1;
        clients[hostIndex].playerNum = playerNum;
        clients[index].playerNum = playerNum;
        console.log(`[${socket.id} - PLAYER]: ${payload.playerName} JOINED ROOM ${payload.roomCode}, TOTAL PLAYERS IN ROOM: ${clients[hostIndex].playerNum}`);
        socket.emit('player-join-response', {
          playerNum: clients[hostIndex].playerNum,
        });
      } else {
        socket.emit('player-join-response');
        console.log(`[${socket.id} - PLAYER]: NO ROOM WAS FOUND`);
      }
    });

    /* save player avatars */
    socket.on('save-avatar', (avatar) => {
      const index = clients.findIndex(player => player.id === socket.id);
      if (index > -1) {
        console.log(`[${socket.id} - PLAYER - ${clients[index].playerName}]: ROOM - `, clients[index].roomCode);
        clients[index].avatar = avatar;
        socket.broadcast.to(clients[index].roomCode).emit('save-avatar-response', { avatar: avatar, playerName: clients[index].playerName, playerNum: clients[index].playerNum });
      }
    });

    /* start game */
    socket.on('start-game', ({ roomCode }) => {
      const host = findHost(roomCode);
      // const realHost = findHost(roomCode);
      const players = findPlayers(roomCode);
      players.forEach((player) => {
        console.log(`[HOST]: Sending keyword for ID - ${player.id} ${player.playerName}`);
        io.to(player.id).emit('send-keyword', {
          keyword: wordList[genRandomNumber(0, wordList.length - 1)],
        });
      });
      console.log('START GAME WITH HOST ID', host.id);
      io.to(host.id).emit('keywords-sent');
    });

    socket.on('submit-drawing', (payload) => {
      findClient(socket).drawing = payload.drawing;
      findClient(socket).keyword = payload.keyword;
    });


    socket.on('start-rounds', (payload) => {
      console.log('*** ATTEMPT TO START ROUNDS ***');
      const host = findClient(socket);
      const roomCode = host.roomCode;
      let allDrawn = false;
      while (!allDrawn) {
        const players = findPlayers(roomCode);
         console.log('in while loop:', players.length);
        allDrawn = players.every(player => player.drawing);
        if (allDrawn) {
          console.log(`**** ALL PLAYERS HAVE DRAWN *** : ROOM: ${roomCode}`);
          // start game 1, loop through all players with drawings
          /* player score */
          // arrayScore [ {id: id, name: name, score: score}, ... ]
          /* game round */
          // game [ answer : {id: id, keyword: keyword, drawing: drawing },
          //        players : [ { id: id, keyword: keyword, guess: guess }, ... ] ]
          let arrOfDrawings = players.filter(player => player.drawing);
          const firstDrawing = arrOfDrawings.shift();
          socket.emit('round-one', { drawing: firstDrawing });


        }
      }
    });
  }); /* socket connection */
};










