import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("join-call", (path) => {
      if (!connections[path]) connections[path] = [];
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      // Notify existing users
      for (const id of connections[path]) {
        io.to(id).emit("user-joined", socket.id, connections[path]);
      }

      // Send chat history
      if (messages[path]) {
        for (const msg of messages[path]) {
          io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [room, found] = Object.entries(connections).reduce(
        ([foundRoom, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [foundRoom, isFound];
        },
        ["", false]
      );

      if (found) {
        if (!messages[room]) messages[room] = [];
        messages[room].push({ sender, data, "socket-id-sender": socket.id });
        console.log(`💬 ${sender}: ${data}`);

        for (const id of connections[room]) {
          io.to(id).emit("chat-message", data, sender, socket.id);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`👋 User disconnected: ${socket.id}`);

      let key;
      for (const [k, v] of Object.entries(connections)) {
        const index = v.indexOf(socket.id);
        if (index !== -1) {
          key = k;
          connections[k].splice(index, 1);

          for (const id of connections[k]) {
            io.to(id).emit("user-left", socket.id);
          }

          if (connections[k].length === 0) {
            delete connections[k];
            delete messages[k];
          }
        }
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};
