import { z } from 'zod';

const messageSchema = z.object({
  id: z.string(),
  content: z.string().min(1, { message: "Message content cannot be empty" }),
  senderId: z.string(),
  timestamp: z.date(),
  status: z.enum(['sent', 'delivered', 'read']),
  type: z.string().optional(),
  unreadCount: z.number().int().nonnegative().optional(),
  
});

export const chatUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  avatar: z.string().url({ message: "Avatar must be a valid URL" }),
  isOnline: z.boolean(),
  lastSeen: z.date().optional(),
  lastMessage: messageSchema,
  messages: z.array(messageSchema),
});

export const messagSchema = z.object({
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long (max 1000 characters)"),
  attachments: z.array(z.string().url()).optional(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name too short"),
  avatar: z.string().url("Invalid avatar URL"),
  isOnline: z.boolean(),
  lastSeen: z.date().optional(),
});

export type ChatMessage = z.infer<typeof messageSchema>;
export type ChatUser = z.infer<typeof chatUserSchema>;
export type User = z.infer<typeof userSchema>;