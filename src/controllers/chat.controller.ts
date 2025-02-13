import { Request, Response } from "express";
import { Server as SocketIO } from "socket.io";

// Array para almacenar los mensajes en memoria por cada sala
const chatRooms: Record<string, string[]> = {};

// Función para obtener los mensajes de una sala específica
export const getMessages = (req: Request, res: Response) => {
    const { roomId } = req.params;
    const messages = chatRooms[roomId] || []; // Devuelve los mensajes de la sala o un array vacío si no existe
    res.json({ messages });
};

// Función para enviar un mensaje (REST)
export const sendMessage = (req: Request, res: Response) => {
    const { roomId, message } = req.body;
    console.log(`Nuevo mensaje en sala ${roomId}:`, message);
    
    if (!chatRooms[roomId]) {
        chatRooms[roomId] = [];  // Si no existe la sala, la inicializamos
    }

    chatRooms[roomId].push(message);  // Añadir el mensaje al array de la sala
    res.json({ status: "Mensaje recibido", message });
};
