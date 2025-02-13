// src/config/socket.config.ts
import { Server as SocketIO } from 'socket.io';

// Array para almacenar los mensajes por sala
const messages: { [key: string]: string[] } = {}; // Usaremos un objeto para almacenar los mensajes por `roomId`

// Función para configurar WebSocket
export const setupWebSocket = (server: any): void => {
    const io = new SocketIO(server, {
        cors: {
            origin: "http://localhost:4200", // URL de tu frontend Angular
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ['websocket', 'polling'], 
        path: '/socket.io/' 
    }); 
    
    io.on('connection', (socket) => {
        socket.on('join room', (roomId: string) => {
            socket.join(roomId); // El usuario se une a la sala
            console.log(`Usuario se unió a la sala: ${roomId}`);
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
