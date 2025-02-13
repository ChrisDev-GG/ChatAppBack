import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/chat.controller";

const router = Router();

router.get("/messages/:roomId", getMessages);
router.post("/messages", sendMessage);

router.get('*', (req: any, res: any) => {
    return res.status(404).json({ ok: false, msg: '404 | Not Found' });
});



export default router;
