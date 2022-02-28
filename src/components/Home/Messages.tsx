import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';

import { BigAvatar, BigBadge } from './StyledComponents';

import * as types from './types';
import * as Q from '../../operations/queries/conversation';
import { socket } from '../../socketIo';

export default function Messages({
  currentUserId,
  currentChat,
  friends,
}: types.MessagesProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<types.Message[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { _id: conversationId, members } = currentChat;
  const { _id, displayName, avatar } = members[0];

  const { loading } = useQuery<types.MessageData, types.MessageVars>(
    Q.GET_MESSAGES,
    {
      variables: { conversationId },
      fetchPolicy: 'network-only',
      onCompleted: ({ getMessages }) => {
        setMessages(getMessages);
      },
    }
  );

  const text = message.trim();
  const latestMessage = messages.slice(-1)[0];
  const unRead =
    latestMessage?.sender?._id !== currentUserId && !latestMessage?.hasRead;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (text) {
      const newMessage = {
        conversationId,
        text,
        sender: currentUserId,
        receiver: [_id],
      };
      socket.emit('sendMessage', newMessage);
      setMessage('');
    }
  };

  const handleFocus = () => {
    unRead && socket.emit('read', { _id: latestMessage?._id, currentUserId });
  };

  const handleBlur = () => {
    socket.emit('blurred');
  };

  useEffect(() => {
    socket.on('newMessage', ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off('newMessage');
    };
  }, []);

  useEffect(() => {
    const isOnline =
      friends.find((friend) => friend._id === _id)?.isOnline || false;
    setIsOnline(isOnline);
  }, [friends, _id]);

  if (loading) return null;

  return (
    <div>
      <div>
        {isOnline ? (
          <BigBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <BigAvatar alt={displayName} src={avatar}>
              {displayName.charAt(0)}
            </BigAvatar>
          </BigBadge>
        ) : (
          <BigAvatar alt={displayName} src={avatar}>
            {displayName.charAt(0)}
          </BigAvatar>
        )}
        <Typography>{displayName}</Typography>
        <Typography variant="body2">
          {isOnline ? 'Active now' : 'Active 50m ago'}
        </Typography>
      </div>

      {messages.map(({ _id, sender, text }) => (
        <div key={_id}>
          <Avatar alt={sender.displayName} src={sender.avatar}>
            {sender.displayName.charAt(0)}
          </Avatar>
          <Typography>{text}</Typography>
        </div>
      ))}

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          value={message}
          onChange={handleChange}
          variant="outlined"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {text && (
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        )}
      </Box>
    </div>
  );
}
