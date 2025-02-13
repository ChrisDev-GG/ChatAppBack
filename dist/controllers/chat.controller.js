"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = void 0;
// Array para almacenar los mensajes en memoria por cada sala
const chatRooms = {};
// Función para obtener los mensajes de una sala específica
const getMessages = (req, res) => {
    const { roomId } = req.params;
    const messages = chatRooms[roomId] || []; // Devuelve los mensajes de la sala o un array vacío si no existe
    res.json({ messages });
};
exports.getMessages = getMessages;
// Función para enviar un mensaje (REST)
const sendMessage = (req, res) => {
    const { roomId, message } = req.body;
    console.log(`Nuevo mensaje en sala ${roomId}:`, message);
    if (!chatRooms[roomId]) {
        chatRooms[roomId] = []; // Si no existe la sala, la inicializamos
    }
    chatRooms[roomId].push(message); // Añadir el mensaje al array de la sala
    res.json({ status: "Mensaje recibido", message });
};
exports.sendMessage = sendMessage;
