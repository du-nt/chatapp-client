import { io } from 'socket.io-client';

const token = localStorage.getItem('accessToken');

export const socket = io('http://localhost:5000', {
  query: { token },
});
