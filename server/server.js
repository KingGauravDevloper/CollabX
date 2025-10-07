const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('object:added', (data) => {
    socket.broadcast.emit('object:added', data);
    console.log(`Object broadcasted from ${socket.id}:`, data.objectId);
  });

  socket.on('object:modified', (data) => {
    socket.broadcast.emit('object:modified', data);
    console.log(`Object modified and broadcasted from ${socket.id}: ${data.objectId}`);
  });

  socket.on('object:removed', (data) => {
    socket.broadcast.emit('object:removed', data);
    console.log(`Object removed and broadcasted from ${socket.id}: ${data.objectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Server is running and listening on port ${PORT}`);
});

