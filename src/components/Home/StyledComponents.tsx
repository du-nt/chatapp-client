import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export const Div = styled('div')(({ theme }) => ({
  display: 'flex',
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#ff5722',
}));

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

export const BigAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#ff5722',
  width: theme.spacing(7),
  height: theme.spacing(7),
  fontSize: '2rem',
}));

export const BigBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    minWidth: 12,
    height: 12,
    borderRadius: '50%',
  },
}));
