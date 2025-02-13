"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = void 0;
// src/config/socket.config.ts
const socket_io_1 = require("socket.io");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Array para almacenar los mensajes por sala
const messages = {}; // Usaremos un objeto para almacenar los mensajes por `roomId`
const sendDiscordWebhook = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
        if (!webhookUrl) {
            console.error('No se ha configurado el webhook de Discord');
            return;
        }
        yield axios_1.default.post(webhookUrl, {
            content: `🚀 Nuevo usuario conectado a la sala: ${roomId}`,
            embeds: [{
                    title: "Nueva conexión al chat",
                    description: `Se ha unido un usuario a la sala ${roomId}`,
                    color: 5814783, // Color azul
                    timestamp: new Date().toISOString()
                }]
        });
    }
    catch (error) {
        console.error('Error al enviar webhook a Discord:', error);
    }
});
// Función para configurar WebSocket
const setupWebSocket = (server) => {
    // Configuración CORS más flexible
    const allowedOrigins = [
        'http://localhost:4200',
        'https://chats.christopher-dev.cl',
        'https://chats-api.christopher-dev.cl'
    ];
    // Middlewares
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ["GET", "POST"],
        },
        transports: ['websocket', 'polling'],
        path: '/socket.io/'
    });
    io.on('connection', (socket) => {
        socket.on('join room', (roomId) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(roomId); // El usuario se une a la sala
            console.log(`Usuario se unió a la sala: ${roomId}`);
            yield sendDiscordWebhook(roomId);
            if (messages[roomId]) {
                socket.emit('chat messages', messages[roomId]);
            }
            else {
                messages[roomId] = [];
            }
        }));
        socket.on('chat message', (roomId, message, name) => {
            console.log('Nuevo mensaje recibido (WebSocket): ', message, name);
            if (!messages[roomId]) {
                messages[roomId] = [];
            }
            messages[roomId].push(message);
            io.to(roomId).emit('chat message', message, name);
            // logear hilo
            messages[roomId].forEach((msg) => {
                console.log(`Mensaje en sala ${roomId}: ${msg}`);
            });
        });
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });
};
exports.setupWebSocket = setupWebSocket;
