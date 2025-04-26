"use client";

import { DeleteChatMessageDialog } from "@/components/dialog/DeleteChatMessageDialog";
import {
  EditChatMessageDialog,
  editChatMessageFormSchema,
} from "@/components/dialog/EdiChatMessageDialog";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Input } from "@/components/ui/shadcn/input";
import { BackendRoutes } from "@/constants/routes/Backend";
import { env } from "@/env/client";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Building,
  BuildingIcon,
  EllipsisVerticalIcon,
  MessagesSquare,
  Star,
  StarIcon,
  User,
  UserIcon,
  Wrench,
  WrenchIcon,
} from "lucide-react";
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
  const [flagId, setFlagId] = useState<string | null>(null);

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

  const { data: interviewSession, isLoading: isLoadingSession } = useQuery({
    queryKey: ["interview-session", interviewSessionId],
    queryFn: async () => {
      const response = await axios.get(
        BackendRoutes.SESSIONS_ID({ id: interviewSessionId }),
      );
      return response;
    },
    enabled: status === "authenticated",
    select: (res) => res?.data?.data,
  });

  const { mutate: createFlag } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(BackendRoutes.FLAGS, {
        user: interviewSession?.user?._id,
        jobListing: interviewSession?.jobListing?._id,
      });

      return response.data.data;
    },
    onSuccess: (data) => {
      setFlagId(data._id);
      toast.success("User flagged successfully");
    },
    onError: (error) => {
      console.error("Error creating flag:", error);
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.error || "Failed to flag user"
          : "Failed to flag user",
      );
    },
  });

  const { mutate: deleteFlag } = useMutation({
    mutationFn: async () => {
      if (!flagId) return;

      await axios.delete(BackendRoutes.FLAGS_ID({ id: flagId }));
    },
    onSuccess: () => {
      setFlagId(null);
      toast.success("User unflagged successfully");
    },
    onError: (error) => {
      console.error("Error deleting flag:", error);
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.error || "Failed to unflag user"
          : "Failed to unflag user",
      );
    },
  });

  const toggleStar = () => {
    if (flagId) {
      deleteFlag();
    } else {
      createFlag();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setupSocket = () => {
    if (status !== "authenticated" || !session?.token) return;

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

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
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
    onSuccess: (_res, variables) => {
      toast.success("Message updated", { id: "update-chat-message" });
      setIsEditOpen(false);
      setSelectedMessage(null);

      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m._id === variables.messageId
            ? { ...m, content: variables.content }
            : m,
        ),
      );
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

  useEffect(() => {
    if (status !== "authenticated" || me?.role !== "company") return;

    if (interviewSession) {
      axios
        .get(
          BackendRoutes.JOB_LISTINGS_ID_FLAGS({
            id: interviewSession.jobListing._id,
          }),
        )
        .then((response) => {
          const flags = response.data.data as Array<{
            _id: string;
            user: { _id: string };
          }>;

          const matchedFlag = flags.find(
            (flag) =>
              String(flag.user._id) === String(interviewSession.user._id),
          );

          if (matchedFlag) {
            setFlagId(matchedFlag._id);
          }
        })
        .catch(console.error);
    }
  }, [status, interviewSession, me?.role]);

  const sendMessage = () => {
    const msg = inputRef.current?.value;
    if (msg && socketRef.current) {
      socketRef.current.emit("chat-message", msg);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const roleStylesMap = {
    admin: "text-nigga-500 font-semibold",
    company: "text-black-500 font-semibold",
    user: "text-black-500 font-semibold",
  } as const;

  const roleEmojis = {
    admin: <WrenchIcon className="h-4 w-4" />,
    company: <BuildingIcon className="h-4 w-4" />,
    user: <UserIcon className="h-4 w-4" />,
  } as const;

  const renderMessage = (msg: Message, index: number) => {
    const isMe = String(msg.sender._id) === String(me?._id);
    const previousSenderId = index > 0 ? messages[index - 1].sender._id : null;
    const isDifferent = msg.sender._id !== previousSenderId;

    const roleStyle = roleStylesMap[msg.sender.role] ?? "text-gray-500";
    const roleEmoji = roleEmojis[msg.sender.role];

    return (
      <div
        key={msg._id}
        className={cn("flex", isMe ? "justify-end" : "justify-start")}
      >
        <div
          className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
        >
          {isDifferent && (
            <div className="mb-1 flex items-center gap-1">
              <span className={roleStyle}>{roleEmoji}</span>
              <span className={cn(roleStyle, "text-sm font-bold capitalize")}>
                {msg.sender.name}
              </span>
            </div>
          )}

          <div className="group flex items-center gap-1">
            {isMe && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="invisible rounded p-1 transition group-hover:visible hover:bg-gray-200">
                    <EllipsisVerticalIcon size={16} className="text-gray-500" />
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
                    className="text-red-600"
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

            <div
              className={cn(
                "max-w-xs rounded-xl p-3 text-sm break-words shadow",
                isMe
                  ? "rounded-br-none bg-black text-white"
                  : "rounded-bl-none bg-gray-100 text-gray-900",
              )}
            >
              {msg.content}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div
      className={cn(
        "mx-auto flex flex-col p-6",
        "h-[calc(100vh-80px)] max-w-3xl",
      )}
    >
      {/* 80px is example navbar height */}
      <div className={cn("mb-2 flex items-center justify-between")}>
        <h2 className={cn("flex items-center gap-2 text-2xl font-semibold")}>
          <MessagesSquare className="h-8 w-8" />
          Chat
        </h2>

        {me?.role === "company" && interviewSession?.user && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleStar}
            disabled={isLoadingSession}
          >
            {flagId ? (
              <StarIcon className="fill-yellow-400 text-yellow-400" />
            ) : (
              <StarIcon className="text-gray-400" />
            )}
          </Button>
        )}
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto rounded-lg border bg-white shadow-inner",
          "space-y-2 p-4 px-8 pt-8",
        )}
      >
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className={cn("mt-4 flex gap-2")}
      >
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          className="flex-grow"
        />
        <button
          type="submit"
          className={cn(
            "rounded-lg bg-black px-4 py-2 text-white",
            "hover:bg-gray-800",
          )}
        >
          Send
        </button>
      </form>

      {selectedMessage && (
        <EditChatMessageDialog
          isPending={isUpdating}
          message={selectedMessage}
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
