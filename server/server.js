const http = require('http');
const express = require('express');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, you should restrict this to your frontend's domain
        methods: ["GET", "POST"]
    }
});

const rooms = {};

// Helper function to update and broadcast history status
const updateHistoryAndBroadcast = (roomId) => {
    const room = rooms[roomId];
    if (room) {
        const historyStatus = {
            canUndo: room.history.length > 1,
            canRedo: room.redoStack.length > 0
        };
        io.to(roomId).emit('history:update', historyStatus);
    }
};

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        
        if (!rooms[roomId]) {
            rooms[roomId] = {
                users: new Set(),
                voiceUsers: new Set(),
                history: [], // History stack for canvas states
                redoStack: []  // Redo stack
            };
        }
        rooms[roomId].users.add(socket.id);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Send the latest canvas state to the new user
        if (rooms[roomId].history.length > 0) {
            socket.emit('canvas:load', rooms[roomId].history[rooms[roomId].history.length - 1]);
        }
        updateHistoryAndBroadcast(roomId);

        socket.on('history:save', (canvasState) => {
            const room = rooms[roomId];
            if (room) {
                room.history.push(canvasState);
                room.redoStack = []; // Clear redo stack on new action
                updateHistoryAndBroadcast(roomId);
            }
        });

        socket.on('history:undo', () => {
            const room = rooms[roomId];
            if (room && room.history.length > 1) {
                const lastState = room.history.pop();
                room.redoStack.push(lastState);
                const previousState = room.history[room.history.length - 1];
                io.to(roomId).emit('canvas:load', previousState);
                updateHistoryAndBroadcast(roomId);
            }
        });

        socket.on('history:redo', () => {
            const room = rooms[roomId];
            if (room && room.redoStack.length > 0) {
                const nextState = room.redoStack.pop();
                room.history.push(nextState);
                io.to(roomId).emit('canvas:load', nextState);
                updateHistoryAndBroadcast(roomId);
            }
        });

        socket.on('object:added', (data) => socket.to(roomId).emit('object:added', data));
        socket.on('object:modified', (data) => socket.to(roomId).emit('object:modified', data));
        socket.on('object:removed', (data) => socket.to(roomId).emit('object:removed', data));
        socket.on('object:layered', (data) => socket.to(roomId).emit('object:layered', data));
        socket.on('path:created', (data) => socket.to(roomId).emit('path:created', data));

        socket.on('cursor:move', (data) => socket.to(roomId).emit('cursor:move', { ...data, id: socket.id }));
        socket.on('join-voice', () => { const otherUsers = Array.from(rooms[roomId].voiceUsers); socket.emit('other-users', otherUsers); rooms[roomId].voiceUsers.add(socket.id); });
        socket.on('offer', (payload) => io.to(payload.target).emit('offer', payload));
        socket.on('answer', (payload) => io.to(payload.target).emit('answer', payload));
        socket.on('ice-candidate', (payload) => io.to(payload.target).emit('ice-candidate', { sender: socket.id, candidate: payload.candidate }));
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
        for (const roomId in rooms) {
            if (rooms[roomId].users.has(socket.id)) {
                rooms[roomId].users.delete(socket.id);
                socket.to(roomId).emit('user:disconnected', { id: socket.id });
                if (rooms[roomId].voiceUsers.has(socket.id)) {
                    rooms[roomId].voiceUsers.delete(socket.id);
                    socket.to(roomId).emit('user-left-voice', { id: socket.id });
                }
                break;
            }
        }
    });
});

// Use the PORT environment variable from the hosting service, or 3001 for local development
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`✅ Server is running and listening on port ${PORT}`));