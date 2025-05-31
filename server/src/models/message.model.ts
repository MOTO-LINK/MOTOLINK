import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";

export interface Message {
    message_id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    timestamp?: Date;
}

export class MessageModel {
    async create(message: Omit<Message, "message_id" | "timestamp">): Promise<Message> {
        const result = await pool.query(
            `INSERT INTO messages (
                message_id, chat_id, sender_id, content
            ) VALUES ($1, $2, $3, $4) RETURNING *`,
            [uuidv4(), message.chat_id, message.sender_id, message.content]
        );
        return result.rows[0];
    }

    async findById(messageId: string): Promise<Message | null> {
        const result = await pool.query("SELECT * FROM messages WHERE message_id = $1", [messageId]);
        return result.rows[0] || null;
    }

    async findByChatId(chatId: string): Promise<Message[]> {
        const result = await pool.query(
            "SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp ASC",
            [chatId]
        );
        return result.rows;
    }

    async update(messageId: string, content: string): Promise<Message | null> {
        const result = await pool.query(
            "UPDATE messages SET content = $1 WHERE message_id = $2 RETURNING *",
            [content, messageId]
        );
        return result.rows[0] || null;
    }

    async delete(messageId: string): Promise<boolean> {
        const result = await pool.query("DELETE FROM messages WHERE message_id = $1 RETURNING *", [messageId]);
        return (result.rowCount ?? 0) > 0;
    }
} 