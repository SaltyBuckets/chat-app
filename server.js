const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let messages = [];
let users = [];
const port = process.env.PORT || 3000;
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  socket.on('auth', (user) => {
    console.log(`${user.name} connected`);
    const usr = {
      name: user.name,
      id: socket.id,
    };
    users.push(usr);
    socket.emit('init', messages);
  });

  socket.on('connect', () => {
    console.log(`a user connected`);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chatMessage', (message) => {
    if (message !== '') {
      const date = getDateTime();
      const msg = {
        message: message.message,
        name: message.name,
        date,
      };

      console.log(`${msg.name}:${msg.message}`);

      io.emit('chatMessage', msg);
      messages.push(msg);
      if (messages.length >= 300) messages.pop();
    }
  });
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

function getDateTime() {
  const today = new Date();
  const date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  const dateTime = `${date} ${time}`;

  return dateTime;
}
