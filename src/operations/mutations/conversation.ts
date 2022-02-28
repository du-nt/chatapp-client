import { gql } from '@apollo/client';

export const CREATE_CONVERSATION = gql`
  mutation createConversation($receiverId: ID!) {
    createConversation(receiverId: $receiverId)
  }
`;
