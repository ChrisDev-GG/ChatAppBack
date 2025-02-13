"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.get("/messages/:roomId", chat_controller_1.getMessages);
router.post("/messages", chat_controller_1.sendMessage);
router.get('*', (req, res) => {
    return res.status(404).json({ ok: false, msg: '404 | Not Found' });
});
exports.default = router;
