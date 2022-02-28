import { Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useRef, useState, useEffect } from 'react';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';

import { BigAvatar, BigBadge } from './StyledComponents';

import * as types from './types';
import { authVar } from '../../cache';
import { socket } from '../../socketIo';
import * as Q from '../../operations/queries/conversation';
import * as M from '../../operations/mutations/conversation';

export default function ChatBox({ currentChat, friends }: types.ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<types.Message[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

  const { _id, displayName, avatar } = currentChat;
  const { user } = useReactiveVar(authVar);

  const { loading } = useQuery<
    types.MessageDataByUser,
    types.MessageVarsByUser
  >(Q.GET_MESSAGES_BY_USER, {
    variables: { userId: _id },
    fetchPolicy: 'network-only',
    onCompleted: ({ getMessagesByUser }) => {
      setMessages(getMessagesByUser.messages);
      conversationIdRef.current = getMessagesByUser.conversationId || '';
    },
  });

  const [createConversation] = useMutation(M.CREATE_CONVERSATION);

  const text = message.trim();
  const latestMessage = messages.slice(-1)[0];
  const unRead =
    latestMessage?.sender?._id !== user?._id && !latestMessage?.hasRead;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFocus = () => {
    unRead &&
      socket.emit('read', {
        _id: latestMessage?._id,
        currentUserId: user?._id,
      });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isSubmittingRef.current) {
      if (text) {
        if (!conversationIdRef.current) {
          isSubmittingRef.current = true;
          const { data } = await createConversation({
            variables: {
              receiverId: _id,
            },
          });
          conversationIdRef.current = data.createConversation;
          const newMessage = {
            conversationId: data.createConversation,
            text,
            sender: user?._id,
            receiver: [_id],
          };
          socket.emit('newConversation', newMessage);
          setMessage('');
          isSubmittingRef.current = false;
        } else {
          const newMessage = {
            conversationId: conversationIdRef.current,
            text,
            sender: user?._id,
            receiver: [_id],
          };
          socket.emit('sendMessage', newMessage);
          setMessage('');
        }
      } else {
        console.log('submit');
      }
    }
  };

  useEffect(() => {
    socket.on('newConversation', ({ message, receiver }) => {
      conversationIdRef.current = message.conversationId;
      setMessages([message]);
    });
    return () => {
      socket.off('newConversation');
    };
  }, []);

  useEffect(() => {
    socket.on('newMessage', ({ message, receiver }) => {
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
    <>
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
          onFocus={handleFocus}
          variant="outlined"
        />
        {text && (
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        )}
      </Box>
    </>
  );
}
