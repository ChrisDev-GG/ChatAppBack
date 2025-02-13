// src/config/socket.config.ts
import { Server as SocketIO } from 'socket.io';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

// Array para almacenar los mensajes por sala
const messages: { [key: string]: string[] } = {}; // Usaremos un objeto para almacenar los mensajes por `roomId`

const sendDiscordWebhook = async (roomId: string) => {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
        if (!webhookUrl) {
            console.error('No se ha configurado el webhook de Discord');
            return;
        }
        await axios.post(webhookUrl, {
            content: `🚀 Nuevo usuario conectado a la sala: ${roomId}`,
            embeds: [{
                title: "Nueva conexión al chat",
                description: `Se ha unido un usuario a la sala ${roomId}`,
                color: 5814783, // Color azul
                timestamp: new Date().toISOString()
            }]
        });
    } catch (error) {
        console.error('Error al enviar webhook a Discord:', error);
    }
};

// Función para configurar WebSocket
export const setupWebSocket = (server: any): void => {
    const io = new SocketIO(server, {
        cors: {
            origin: process.env.ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:4200",
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ['websocket', 'polling'], 
        path: '/socket.io/' 
    }); 
    
    io.on('connection', (socket) => {
        socket.on('join room', async (roomId: string) => {
            socket.join(roomId); // El usuario se une a la sala
            console.log(`Usuario se unió a la sala: ${roomId}`);
            await sendDiscordWebhook(roomId);
            if (messages[roomId]) {
                socket.emit('chat messages', messages[roomId]);
            } else {
                messages[roomId] = [];
            }
        });
        socket.on('chat message', (roomId:string, message:string, name:string) => {
            console.log('Nuevo mensaje recibido (WebSocket): ', message, name);
            if (!messages[roomId]) { messages[roomId] = [] }
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

