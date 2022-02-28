import { useState } from 'react';
import { Typography } from '@mui/material';

import { StyledBadge, StyledAvatar, Div } from './StyledComponents';
import Messages from './Messages';

import * as types from './types';
import { socket } from '../../socketIo';

export default function Conversations({
  friends,
  conversations,
  currentUserId,
}: types.ConversationsProps) {
  const [currentChat, setCurrentChat] = useState<types.CurrentChat | null>(
    null
  );

  const handleClick = ({ _id, members, latestMessage }: types.Conversation) => {
    setCurrentChat({ _id, members });
    const unRead =
      latestMessage.sender._id !== currentUserId && !latestMessage.hasRead;
    unRead && socket.emit('read', { _id: latestMessage._id, currentUserId });
  };

  return (
    <Div>
      {conversations.length ? (
        <>
          <div>
            {conversations.map(({ _id, members, latestMessage }) => (
              <Div
                sx={
                  _id === currentChat?._id
                    ? { backgroundColor: '#aaa' }
                    : { backgroundColor: '#fff' }
                }
                key={_id}
                onClick={() => handleClick({ _id, members, latestMessage })}
              >
                {friends.find(({ _id }) => _id === members[0]._id)?.isOnline ? (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                  >
                    <StyledAvatar
                      alt={members[0].displayName}
                      src={members[0].avatar}
                    >
                      {members[0].displayName.charAt(0)}
                    </StyledAvatar>
                  </StyledBadge>
                ) : (
                  <StyledAvatar
                    alt={members[0].displayName}
                    src={members[0].avatar}
                  >
                    {members[0].displayName.charAt(0)}
                  </StyledAvatar>
                )}
                <div>
                  <Typography>{members[0].displayName}</Typography>
                  <Typography
                    color={
                      latestMessage.sender._id !== currentUserId &&
                      !latestMessage.hasRead
                        ? 'primary'
                        : 'textSecondary'
                    }
                    variant={
                      latestMessage.sender._id !== currentUserId &&
                      !latestMessage.hasRead
                        ? 'subtitle2'
                        : 'body1'
                    }
                  >
                    {latestMessage.sender._id !== currentUserId
                      ? latestMessage.text
                      : `You: ${latestMessage.text}`}
                  </Typography>
                </div>
              </Div>
            ))}
          </div>

          <div>
            {currentChat ? (
              <Messages
                friends={friends}
                currentUserId={currentUserId}
                currentChat={currentChat}
              />
            ) : (
              <Typography>Select a conversation</Typography>
            )}
          </div>
        </>
      ) : (
        <Typography>No conversations</Typography>
      )}
    </Div>
  );
}
