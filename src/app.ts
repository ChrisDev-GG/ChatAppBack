import express from "express";
import cors from "cors";
import http from "http";
import chatRoutes from "./routes/chat.routes";
import { setupWebSocket } from "./config/socket.config";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middlewares
// Configuración CORS más flexible
const allowedOrigins = [
  'http://localhost:4200',
  'https://chats.christopher-dev.cl',
  'https://chats-api.christopher-dev.cl'
];

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
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
