import { useState } from 'react';
import Typography from '@mui/material/Typography';

import * as types from './types';
import { StyledBadge, StyledAvatar, Div } from './StyledComponents';
import ChatBox from './ChatBox';

export default function People({ friends }: types.PeopleProps) {
  const [currentChat, setCurrentChat] = useState<types.Friend | null>(null);

  const handleClick = (user: types.Friend) => setCurrentChat(user);

  return (
    <Div>
      <div>
        {friends.map(({ _id, displayName, isOnline, avatar }) => (
          <Div
            key={_id}
            onClick={() => handleClick({ _id, displayName, isOnline, avatar })}
          >
            {isOnline ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <StyledAvatar alt={displayName} src={avatar}>
                  {displayName.charAt(0)}
                </StyledAvatar>
              </StyledBadge>
            ) : (
              <StyledAvatar alt={displayName} src={avatar}>
                {displayName.charAt(0)}
              </StyledAvatar>
            )}
            <Typography>{displayName}</Typography>
          </Div>
        ))}
      </div>

      <div>
        {currentChat ? (
          <ChatBox friends={friends} currentChat={currentChat} />
        ) : (
          <Typography>Select some one</Typography>
        )}
      </div>
    </Div>
  );
}
