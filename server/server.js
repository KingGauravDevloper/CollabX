const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();

/**
 * Serve frontend files
 * Make sure your index.html + JS files are inside /public
 */
app.use(express.static("public"));

/**
 * Health check (important for deployment)
 */
app.get("/health", (req, res) => {
    res.send("OK");
});

const server = http.createServer(app);

/**
 * Socket.IO configuration
 * origin: true → works for both local & production
 */
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
});

/**
 * In-memory room storage
 */
const rooms = {};

/**
 * Helper: update undo/redo buttons state
 */
const updateHistoryAndBroadcast = (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    io.to(roomId).emit("history:update", {
        canUndo: room.history.length > 1,
        canRedo: room.redoStack.length > 0
    });
};

/**
 * Socket connection
 */
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on("join-room", (roomId) => {
        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = {
                users: new Set(),
                voiceUsers: new Set(),
                history: [],
                redoStack: []
            };
        }

        rooms[roomId].users.add(socket.id);
        console.log(`👥 ${socket.id} joined room ${roomId}`);

        // Send latest canvas state to new user
        if (rooms[roomId].history.length > 0) {
            socket.emit(
                "canvas:load",
                rooms[roomId].history[rooms[roomId].history.length - 1]
            );
        }

        updateHistoryAndBroadcast(roomId);

        /**
         * Canvas history
         */
        socket.on("history:save", (canvasState) => {
            const room = rooms[roomId];
            if (!room) return;

            room.history.push(canvasState);
            room.redoStack = [];
            updateHistoryAndBroadcast(roomId);
        });

        socket.on("history:undo", () => {
            const room = rooms[roomId];
            if (!room || room.history.length <= 1) return;

            const last = room.history.pop();
            room.redoStack.push(last);

            io.to(roomId).emit(
                "canvas:load",
                room.history[room.history.length - 1]
            );

            updateHistoryAndBroadcast(roomId);
        });

        socket.on("history:redo", () => {
            const room = rooms[roomId];
            if (!room || room.redoStack.length === 0) return;

            const next = room.redoStack.pop();
            room.history.push(next);

            io.to(roomId).emit("canvas:load", next);
            updateHistoryAndBroadcast(roomId);
        });

        /**
         * Canvas sync
         */
        socket.on("object:added", (data) =>
            socket.to(roomId).emit("object:added", data)
        );

        socket.on("object:modified", (data) =>
            socket.to(roomId).emit("object:modified", data)
        );

        socket.on("object:removed", (data) =>
            socket.to(roomId).emit("object:removed", data)
        );

        socket.on("object:layered", (data) =>
            socket.to(roomId).emit("object:layered", data)
        );

        socket.on("path:created", (data) =>
            socket.to(roomId).emit("path:created", data)
        );

        /**
         * Cursor tracking
         */
        socket.on("cursor:move", (data) => {
            socket.to(roomId).emit("cursor:move", {
                ...data,
                id: socket.id
            });
        });

        /**
         * Voice (WebRTC signaling)
         */
        socket.on("join-voice", () => {
            const otherUsers = Array.from(rooms[roomId].voiceUsers);
            socket.emit("other-users", otherUsers);
            rooms[roomId].voiceUsers.add(socket.id);
        });

        socket.on("offer", (payload) =>
            io.to(payload.target).emit("offer", payload)
        );

        socket.on("answer", (payload) =>
            io.to(payload.target).emit("answer", payload)
        );

        socket.on("ice-candidate", (payload) =>
            io.to(payload.target).emit("ice-candidate", {
                sender: socket.id,
                candidate: payload.candidate
            })
        );
    });

    /**
     * Disconnect cleanup
     */
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);

        for (const roomId in rooms) {
            const room = rooms[roomId];

            if (room.users.has(socket.id)) {
                room.users.delete(socket.id);
                socket.to(roomId).emit("user:disconnected", { id: socket.id });

                if (room.voiceUsers.has(socket.id)) {
                    room.voiceUsers.delete(socket.id);
                    socket
                        .to(roomId)
                        .emit("user-left-voice", { id: socket.id });
                }

                // 🔥 Clean empty rooms (VERY IMPORTANT)
                if (room.users.size === 0) {
                    delete rooms[roomId];
                }

                break;
            }
        }
    });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
