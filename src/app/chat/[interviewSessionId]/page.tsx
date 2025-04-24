"use client";

import { DeleteChatMessageDialog } from "@/components/dialog/DeleteChatMessageDialog";
import {
  EditChatMessageDialog,
  editChatMessageFormSchema,
} from "@/components/dialog/EdiChatMessageDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { BackendRoutes } from "@/constants/routes/Backend";
import { env } from "@/env/client";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { EllipsisIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { z } from "zod";

export default function Chat() {
  const { interviewSessionId } = useParams<{ interviewSessionId: string }>();
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Array<Message>>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const { data: me } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
    enabled: status === "authenticated",
    select: (res) => res?.data?.data,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setupSocket = () => {
    if (status !== "authenticated" || !session?.token) return;

    console.log(env.NEXT_PUBLIC_WS_BASE_URL);

    const socket = io(env.NEXT_PUBLIC_WS_BASE_URL, {
      auth: { token: session.token },
      query: { interviewSession: interviewSessionId },
    });

    socketRef.current = socket;

    socket.on("chat-message", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("chat-updated", (msg) =>
      setMessages((prev) =>
        prev.map((m) =>
          m._id === msg._id ? { ...m, content: msg.content } : m,
        ),
      ),
    );
    socket.on("chat-deleted", ({ messageId }) =>
      setMessages((prev) => prev.filter((m) => m._id !== messageId)),
    );

    socket.on("chat-history", (msgs) => setMessages(msgs));
    socket.on("chat-error", ({ error }) => {
      toast.error("Chat error", { id: "chat-error", description: error });
    });
  };

  const { mutate: updateChatMessage, isPending: isUpdating } = useMutation({
    mutationFn: (
      data: z.infer<typeof editChatMessageFormSchema> & { messageId: string },
    ) =>
      axios.put(
        BackendRoutes.CHAT_ID_ID({
          interviewSessionId,
          messageId: data.messageId,
        }),
        data,
      ),
    onMutate: () =>
      toast.loading("Updating message...", { id: "update-chat-message" }),
    onSuccess: () => {
      toast.success("Message updated", { id: "update-chat-message" });
      setIsEditOpen(false);
      setSelectedMessage(null);
    },
    onError: (error) => {
      toast.error("Failed to update message", {
        id: "update-chat-message",
        description: isAxiosError(error)
          ? error.response?.data?.error
          : "Something went wrong",
      });
    },
  });

  const { mutate: deleteChatMessage, isPending: isDeleting } = useMutation({
    mutationFn: ({ messageId }: { messageId: string }) =>
      axios.delete(BackendRoutes.CHAT_ID_ID({ interviewSessionId, messageId })),
    onMutate: () =>
      toast.loading("Deleting message...", { id: "delete-chat-message" }),
    onSuccess: () => {
      toast.success("Message deleted", { id: "delete-chat-message" });
      setIsDeleteOpen(false);
      setSelectedMessage(null);
    },
    onError: (error) => {
      toast.error("Failed to delete message", {
        id: "delete-chat-message",
        description: isAxiosError(error)
          ? error.response?.data?.error
          : "Something went wrong",
      });
    },
  });

  useEffect(scrollToBottom, [messages]);
  useEffect(setupSocket, [status, session?.token, interviewSessionId]);

  const sendMessage = () => {
    const msg = inputRef.current?.value;
    if (msg && socketRef.current) {
      socketRef.current.emit("chat-message", msg);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const renderMessage = (msg: Message, index: number) => {
    const isMe = String(msg.sender._id) === String(me?._id);

    const roleStyles =
      {
        admin: "text-red-500 font-semibold",
        company: "text-indigo-500 font-semibold",
        user: "text-blue-500 font-semibold",
      }[msg.sender.role] ?? "text-gray-500";

    const roleEmoji =
      {
        admin: "🛠️",
        company: "🏢",
        user: "🙋",
      }[msg.sender.role] ?? "";

    return (
      <div
        key={index}
        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
      >
        <div
          className={cn(
            "max-w-[70%] space-y-1 rounded-xl px-4 py-3 text-sm break-all shadow",
            isMe
              ? "rounded-br-none bg-blue-100 text-gray-800"
              : "rounded-bl-none bg-gray-100 text-gray-800",
          )}
        >
          <div className="flex justify-between gap-3">
            <div className="flex gap-1">
              <p
                className={cn(roleStyles, "text-md font-extrabold capitalize")}
              >
                {roleEmoji} {msg.sender.role}
              </p>
              <p className={cn(roleStyles, "mb-1")}>{msg.sender.name}</p>
            </div>
            {isMe && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-0">
                    <EllipsisIcon size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedMessage(msg);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit Message
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => {
                      setSelectedMessage(msg);
                      setIsDeleteOpen(true);
                    }}
                  >
                    Delete Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p>{msg.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h2 className="mb-4 text-2xl font-semibold">💬 Chat</h2>

      <div className="h-96 space-y-2 overflow-y-scroll rounded-lg border bg-white p-4 shadow-sm">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-grow rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Send
        </button>
      </form>

      {selectedMessage && (
        <EditChatMessageDialog
          message={selectedMessage}
          isPending={isUpdating}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          onUpdate={(data) =>
            updateChatMessage({ ...data, messageId: selectedMessage._id })
          }
        />
      )}

      {selectedMessage && (
        <DeleteChatMessageDialog
          isPending={isDeleting}
          isOpen={isDeleteOpen}
          onDelete={() => deleteChatMessage({ messageId: selectedMessage._id })}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
}
