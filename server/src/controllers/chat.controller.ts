import { Request, Response } from "express";
import { ChatModel } from "../models/chat.model";
import { MessageModel } from "../models/message.model";
import { TokenPayload } from "../utils/types";

interface AuthRequest extends Request {
    user?: TokenPayload;
}

// Store SSE clients 
const clients = new Map<string, Response>();

export class ChatController {
    private chatModel = new ChatModel();
    private messageModel = new MessageModel();

    async subscribe(req: AuthRequest, res: Response) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        });

        clients.set(req.user.userId, res);

        req.on("close", () => {
            clients.delete(req.user!.userId);
        });
    }

    // send updates to connected clients
    private async notifyClients(chatId: string, message: any) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) return;

        // Send to both rider and driver
        const recipientIds = [chat.rider_id, chat.driver_id];
        recipientIds.forEach(id => {
            const client = clients.get(id);
            if (client) {
                client.write(`data: ${JSON.stringify(message)}\n\n`);
            }
        });
    }

    // Create a new chat
    async createChat(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { rider_id, driver_id } = req.body;

            // Verify the user is either the rider or an admin
            if (req.user.userType !== "admin" && req.user.userId !== rider_id) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const chat = await this.chatModel.create({ rider_id, driver_id });
            res.status(201).json(chat);
        } catch (error) {
            res.status(500).json({ message: "Error creating chat", error });
        }
    }

    // Get user's chats
    async getChats(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const chats = await this.chatModel.findByUserId(req.user.userId);
            res.json(chats);
        } catch (error) {
            res.status(500).json({ message: "Error fetching chats", error });
        }
    }

    // Send a message
    async sendMessage(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { chat_id, content } = req.body;
            
            // Verify user is part of the chat
            const chat = await this.chatModel.findById(chat_id);
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            if (req.user.userType !== "admin" && 
                req.user.userId !== chat.rider_id && 
                req.user.userId !== chat.driver_id) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const message = await this.messageModel.create({
                chat_id,
                sender_id: req.user.userId,
                content
            });

            // Notify connected clients about the new message
            await this.notifyClients(chat_id, {
                type: "new_message",
                data: message
            });

            res.status(201).json(message);
        } catch (error) {
            res.status(500).json({ message: "Error sending message", error });
        }
    }

    // Get chat messages
    async getChatMessages(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { chatId } = req.params;

            // Verify user is part of the chat
            const chat = await this.chatModel.findById(chatId);
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            if (req.user.userType !== "admin" && 
                req.user.userId !== chat.rider_id && 
                req.user.userId !== chat.driver_id) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const messages = await this.messageModel.findByChatId(chatId);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: "Error fetching messages", error });
        }
    }

    // Delete a chat
    async deleteChat(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const { chatId } = req.params;

            // Verify user is part of the chat
            const chat = await this.chatModel.findById(chatId);
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            if (req.user.userType !== "admin" && 
                req.user.userId !== chat.rider_id && 
                req.user.userId !== chat.driver_id) {
                return res.status(403).json({ message: "Forbidden" });
            }

            await this.chatModel.delete(chatId);

            // Notify connected clients about chat deletion
            await this.notifyClients(chatId, {
                type: "chat_deleted",
                data: { chat_id: chatId }
            });

            res.json({ message: "Chat deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting chat", error });
        }
    }
} 