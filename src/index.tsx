import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, from, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import jwtDecode, { JwtPayload } from 'jwt-decode';

import './index.css';
import App from './App';
import { authVar, cache } from './cache';
import { saveTokenToStorage } from './utils';
import * as Q from './operations/queries/user';

import reportWebVitals from './reportWebVitals';

let refreshTokenRequest: any = null;

const renewTokenApiClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:5000/graphql',
  }),
  cache,
});

const renewToken = async () => {
  try {
    const token = await localStorage.getItem('refreshToken');
    if (!token) return null;

    const { data } = await renewTokenApiClient.query({
      query: Q.RENEW_TOKEN,
      variables: { token },
    });
    const {
      renewToken: { accessToken, refreshToken },
    } = data;
    await saveTokenToStorage(accessToken, refreshToken);
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getToken = async () => {
  try {
    const accessToken = await localStorage.getItem('accessToken');
    if (!accessToken) return null;

    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (!decoded || !decoded.exp) return null;

    const expirationTime = decoded.exp * 1000 - 60000;
    if (Date.now() >= expirationTime) {
      refreshTokenRequest = refreshTokenRequest
        ? refreshTokenRequest
        : renewToken();
      const newAccessToken = await refreshTokenRequest;
      refreshTokenRequest = null;
      return newAccessToken;
    }
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const authLink = setContext(async (_, { headers }) => {
  const token = await getToken();
  if (!token) {
    authVar({ isAuthenticated: false, user: null });
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache,
  connectToDevTools: true,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
