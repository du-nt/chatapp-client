import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query getConversations {
    getConversations {
      _id
      members {
        _id
        displayName
        avatar
      }
      latestMessage {
        _id
        text
        sender {
          _id
        }
        hasRead
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query getMessages($conversationId: ID!) {
    getMessages(conversationId: $conversationId) {
      _id
      sender {
        _id
        displayName
        avatar
      }
      text
      hasRead
    }
  }
`;

export const GET_MESSAGES_BY_USER = gql`
  query getMessagesByUser($userId: ID!) {
    getMessagesByUser(userId: $userId) {
      conversationId
      messages {
        _id
        sender {
          _id
          displayName
          avatar
        }
        text
        hasRead
      }
    }
  }
`;
