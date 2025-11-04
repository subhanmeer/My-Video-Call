import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";


dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.set("port", process.env.PORT || 8001);


import { Server } from "socket.io";

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MONGO Connected: ${connectionDb.connection.host}`);

    const port = app.get("port");
    server.listen(port, () => {
      console.log(`✅ Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect MongoDB:", error.message);
  }
};

start();
