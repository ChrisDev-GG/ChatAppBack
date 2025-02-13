"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const socket_config_1 = require("./config/socket.config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
// Configuración CORS más flexible
const allowedOrigins = [
    'http://localhost:4200',
    'https://chats.christopher-dev.cl',
    'https://chats-api.christopher-dev.cl'
];
// Middlewares
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express_1.default.json()); // Para manejar JSON en el body
// Crear servidor HTTP
const server = http_1.default.createServer(app);
(0, socket_config_1.setupWebSocket)(server);
// Rutas
app.use("/api/chat", chat_routes_1.default);
// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
