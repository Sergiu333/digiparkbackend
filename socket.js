const { Server } = require('socket.io');

let io;

module.exports.init = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*", // Setează originul dorit
            methods: ["GET", "POST"]
        }
    });
    return io;
};

module.exports.getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
