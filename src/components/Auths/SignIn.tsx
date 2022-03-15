import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { NavLink } from 'react-router-dom';

import * as M from '../../operations/mutations/user';
import { saveTokenToStorage } from '../../utils';
import { authVar } from '../../cache';

type SignInInput = {
  email: string;
  password: string;
};

const defaultValues: SignInInput = {
  email: '',
  password: '',
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email not valid').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6')
    .max(30, 'Password too long')
    .required('Password is required'),
});

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

export default function SignIn() {
  const [login] = useMutation(M.LOGIN, {
    onCompleted: ({ login }) => {
      const { accessToken, refreshToken, user } = login;
      saveTokenToStorage(accessToken, refreshToken);
      authVar({
        isAuthenticated: true,
        user,
      });
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors);
      // const message = err.graphQLErrors[0].extensions.errors.email | '';
      setError('email', {
        message: 'hehe',
      });
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<SignInInput>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<SignInInput> = (values) => {
    login({
      variables: values,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Link component={NavLink} to="/">
        Home
      </Link>
      <CssBaseline />
      <StyledBox>
        <StyledAvatar>
          <LockOutlinedIcon />
        </StyledAvatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="off"
                autoFocus
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : null}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="off"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : null}
              />
            )}
          />
          <StyledButton type="submit" fullWidth variant="contained">
            Sign In
          </StyledButton>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2" component={NavLink}>
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </StyledBox>
    </Container>
  );
}
