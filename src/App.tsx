import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';

import Home from './components/Home';
import SignIn from './components/Auths/SignIn';
import SignUp from './components/Auths/SignUp';
import { PrivateRoute, GoHomeIfLogged } from './routes';

import * as Q from './operations/queries/user';
import { authVar } from './cache';

const Spinner = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  bottom: '50%',
  left: '50%',
  transform: 'translate(-50%,50%)',
  color: theme.palette.primary.main,
}));

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const { data } = useQuery(Q.GET_ME, {
    onCompleted: (data) => {
      authVar({
        isAuthenticated: true,
        user: data.getMe,
      });
      setAppLoading(false);
    },
    onError: () => {
      setAppLoading(false);
    },
  });

  if (appLoading) return <Spinner />;

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute component={Home} />} />
      <Route path="signin" element={<GoHomeIfLogged component={SignIn} />} />
      <Route path="signup" element={<GoHomeIfLogged component={SignUp} />} />
    </Routes>
  );
}
