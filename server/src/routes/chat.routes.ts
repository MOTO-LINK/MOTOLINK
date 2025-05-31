import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";
import { RequestHandler } from "express";

const router = Router();
const chatController = new ChatController();

// SSE endpoint
router.get("/subscribe", authenticate, (chatController.subscribe.bind(chatController) as RequestHandler));

// Chat CRUD operations
router.post("/", authenticate, (chatController.createChat.bind(chatController) as RequestHandler));
router.get("/", authenticate, (chatController.getChats.bind(chatController) as RequestHandler));
router.delete("/:chatId", authenticate, (chatController.deleteChat.bind(chatController) as RequestHandler));

// Message operations
router.post("/messages", authenticate, (chatController.sendMessage.bind(chatController) as RequestHandler));
router.get("/:chatId/messages", authenticate, (chatController.getChatMessages.bind(chatController) as RequestHandler));

export default router; 