import { db } from "@/app/db/drizzle";
import { conversation, message } from "@/app/db/schema";
import { UIMessage } from "ai";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function loadChat(
  conversationId: string
): Promise<UIMessage[]> {
  const messages = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(desc(message.createdAt));

  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    parts: [
      {
        type: "text",
        text: msg.content,
      },
    ],
  }));
}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  // Check if conversation exists

  const conv = await db
    .select({ userId: conversation.userId })
    .from(conversation)
    .where(eq(conversation.id, chatId))
    .limit(1);

  if (!conv.length) {
    return;
  }

  const userId = conv[0].userId;

  /// getting existing messages to avoid duplicates

  const existingMessages = await db
    .select({ id: message.id })
    .from(message)
    .where(eq(message.conversationId, chatId));

  const existingIds = new Set(existingMessages.map((msg) => msg.id));

  // only new messages saved

  const newMessages = messages.filter(
    (msg) => !existingIds.has(msg.id)
  );

  if (!newMessages.length) {
    return;
  }

  // transform messages to db format

  const dbMessages = newMessages.map((msg) => {
    const text =
      msg.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");

    return {
      id: msg.id ?? nanoid(),
      conversationId: chatId,
      userId,
      role: msg.role,
      content: text,
    };
  });

  await db.insert(message).values(dbMessages);

  // update conversation title

  const firstMessage = newMessages.find((msg) => msg.role === "user");

  if (firstMessage) {
    const title =
      firstMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("")
        .slice(0, 50) || "New Conversation";

    await db
      .update(conversation)
      .set({
        title,
      })
      .where(eq(conversation.id, chatId));
  }
}