import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import { useReactiveVar, useQuery } from '@apollo/client';

import Conversations from './Conversations';
import People from './People';

import { authVar } from '../../cache';
import { socket } from '../../socketIo';
import * as types from './types';
import * as Q from '../../operations/queries/conversation';

function TabPanel(props: types.TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  );
}

const Label = ({ badge }: { badge: number }) => (
  <Badge badgeContent={badge} color="primary">
    <Typography variant="button">Conversations</Typography>
  </Badge>
);

export default function Home() {
  const [friends, setFriends] = useState<types.Friend[]>([]);
  const [value, setValue] = useState(0);
  // const [badge, setBadge] = useState(0);
  const [conversations, setConversations] = useState<types.Conversation[]>([]);

  const { user } = useReactiveVar(authVar);

  const { loading } = useQuery<types.ConversationData>(Q.GET_CONVERSATIONS, {
    onCompleted: ({ getConversations }) => {
      setConversations(getConversations);
    },
    fetchPolicy: 'network-only',
  });

  const badge = conversations.filter(
    (conversation) =>
      conversation.latestMessage.hasRead === false &&
      conversation.latestMessage.sender._id !== user?._id
  ).length;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    socket.emit('getUsers');
    socket.on('friendList', (users) => {
      setFriends(users);
    });
    socket.on('online', (userId) => {
      setFriends((prev) =>
        prev.map((user) => {
          if (user._id === userId) {
            return { ...user, isOnline: true };
          }
          return user;
        })
      );
    });
    socket.on('offline', (userId) => {
      setFriends((prev) =>
        prev.map((user) => {
          if (user._id === userId) {
            return { ...user, isOnline: false };
          }
          return user;
        })
      );
    });
  }, []);

  useEffect(() => {
    socket.on('newMessage', ({ message }) => {
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              latestMessage: {
                _id: message._id,
                text: message.text,
                sender: {
                  _id: message.sender._id,
                },
                hasRead: message.hasRead,
              },
            };
          }
          return conversation;
        })
      );
    });
    return () => {
      socket.off('newMessage');
    };
  }, []);

  useEffect(() => {
    socket.on('newConversation', ({ message, conversation }) => {
      const newConversation = {
        ...conversation,
        latestMessage: message,
      };
      setConversations((prev) => [newConversation, ...prev]);
    });
    return () => {
      socket.off('newConversation');
    };
  }, []);

  useEffect(() => {
    socket.on('read', ({ conversationId }) => {
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              latestMessage: {
                ...conversation.latestMessage,
                hasRead: true,
              },
            };
          }
          return conversation;
        })
      );
    });
    return () => {
      socket.off('read');
    };
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label={<Label badge={badge} />} />
        <Tab label="People" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Conversations
          currentUserId={user?._id}
          friends={friends}
          conversations={conversations}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <People friends={friends} />
      </TabPanel>
    </>
  );
}
