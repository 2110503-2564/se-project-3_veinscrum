interface Message {
  _id: string;
  sender: User;
  content: string;
  timestamp: Date;
}

interface Chat {
  interviewSession: string;
  messages: Array<Message>;
}

interface POSTChatRequest {
  content: string;
}
