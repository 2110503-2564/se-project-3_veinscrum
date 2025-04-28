interface ServerToClientEvents {
  "chat-message": (message: Message) => void;
  "chat-updated": (message: Message) => void;
  "chat-history": (messages: Array<Message>) => void;
  "chat-deleted": (data: { messageId: string }) => void;
  "chat-error": (data: { error: string }) => void;
}
