export type User = {
  _id: string;
  avatar: string;
  displayName: string;
};

export type Friend = User & {
  isOnline: boolean;
};

export type Message = {
  _id: string;
  sender: User;
  text: string;
  conversationId: string;
  hasRead: boolean;
};

export type CurrentChat = {
  _id: string;
  members: User[];
};

export type Conversation = {
  _id: string;
  members: User[];
  latestMessage: {
    _id: string;
    text: string;
    sender: {
      _id: string;
    };
    hasRead: boolean;
  };
};

export type ConversationData = {
  getConversations: Conversation[];
};

export type MessageData = {
  getMessages: Message[];
};

export type MessageVars = {
  conversationId: string;
};

export type MessageDataByUser = {
  getMessagesByUser: {
    conversationId: string;
    messages: Message[];
  };
};

export type MessageVarsByUser = {
  userId: string;
};

export type ChatBoxProps = {
  currentChat: Friend;
  friends: Friend[];
};

export type ConversationsProps = {
  friends: Friend[];
  conversations: Conversation[];
  currentUserId?: string;
};

export type PeopleProps = {
  friends: Friend[];
};

export type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export type MessagesProps = {
  currentChat: CurrentChat;
  currentUserId?: string;
  friends: Friend[];
};
