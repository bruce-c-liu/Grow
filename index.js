const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//middleware
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.resolve('public/html/index.html')));

server.listen(3000, () => {
  console.log(`App listening at http://localhost:${3000}`);
});

const playerIDs = new Set();

io.on('connection', (socket) => {
  // notify all other players of new joiner
  socket.broadcast.emit('playerConnected', { id: socket.id });

  // notify new joiner of players already in game
  socket.emit('playersInRoom', Array.from(playerIDs));

  playerIDs.add(socket.id);

  //position = {x,y}
  socket.on('playerPositionUpdated', (position) =>
    socket.broadcast.emit('playerPositionUpdated', { ...position, id: socket.id })
  );

  socket.on('disconnect', () => {
    socket.broadcast.emit('playerDisconnected', { id: socket.id });
    playerIDs.delete(socket.id);
  });

  // console.log(io.of('/').connected);

  // socket.on('update', (player) => {
  //   socket.broadcast.emit('update', {
  //     x: player.x,
  //     y: player.y,
  //   });
  // });
});
