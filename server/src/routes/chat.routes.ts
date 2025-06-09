import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authenticateToken as authenticate } from "../middleware/auth.middleware";
import { RequestHandler } from "express";

const router = Router();
const chatController = new ChatController();
router.use(authenticate);

// SSE endpoint
router.get("/subscribe", (chatController.subscribe.bind(chatController) as RequestHandler));

// Chat CRUD operations
router.post("/", (chatController.createChat.bind(chatController) as RequestHandler));
router.get("/", (chatController.getChats.bind(chatController) as RequestHandler));
router.delete("/:chatId", (chatController.deleteChat.bind(chatController) as RequestHandler));

// Message operations
router.post("/messages", (chatController.sendMessage.bind(chatController) as RequestHandler));
router.get("/:chatId/messages", (chatController.getChatMessages.bind(chatController) as RequestHandler));

export default router; 