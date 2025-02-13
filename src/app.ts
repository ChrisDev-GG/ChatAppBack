import express from "express";
import cors from "cors";
import http from "http";
import chatRoutes from "./routes/chat.routes";
import { setupWebSocket } from "./config/socket.config";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:4200",
    methods: ["GET", "POST"]
  }));
app.use(express.json()); // Para manejar JSON en el body

// Crear servidor HTTP
const server = http.createServer(app);
setupWebSocket(server);

// Rutas
app.use("/api/chat", chatRoutes);

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
