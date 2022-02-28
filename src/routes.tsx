import { Navigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';

import { authVar } from './cache';

type RouteProps = {
  component: React.FC;
};

export const PrivateRoute = ({ component: Component }: RouteProps) => {
  const { isAuthenticated } = useReactiveVar(authVar);

  return isAuthenticated ? <Component /> : <Navigate to="/signin" />;
};

export const GoHomeIfLogged = ({ component: Component }: RouteProps) => {
  const { isAuthenticated } = useReactiveVar(authVar);

  return isAuthenticated ? <Navigate to="/" /> : <Component />;
};
