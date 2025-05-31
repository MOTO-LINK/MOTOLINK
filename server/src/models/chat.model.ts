import { v4 as uuidv4 } from "uuid";
import pool from "../utils/database";

export interface Chat {
    chat_id: string;
    rider_id: string;
    driver_id: string;
    created_at?: Date;
    updated_at?: Date;
}

export class ChatModel {
    async create(chat: Omit<Chat, "chat_id" | "created_at" | "updated_at">): Promise<Chat> {
        const result = await pool.query(
            `INSERT INTO chats (
                chat_id, rider_id, driver_id
            ) VALUES ($1, $2, $3) RETURNING *`,
            [uuidv4(), chat.rider_id, chat.driver_id]
        );
        return result.rows[0];
    }

    async findById(chatId: string): Promise<Chat | null> {
        const result = await pool.query("SELECT * FROM chats WHERE chat_id = $1", [chatId]);
        return result.rows[0] || null;
    }

    async findByUserId(userId: string): Promise<Chat[]> {
        const result = await pool.query(
            "SELECT * FROM chats WHERE rider_id = $1 OR driver_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return result.rows;
    }

    async delete(chatId: string): Promise<boolean> {
        const result = await pool.query("DELETE FROM chats WHERE chat_id = $1 RETURNING *", [chatId]);
        return (result.rowCount ?? 0) > 0;
    }
} 