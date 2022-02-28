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
import { NavLink } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';

import * as M from '../../operations/mutations/user';

type SignUpInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const defaultValues: SignUpInput = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validationSchema = Yup.object().shape({
  displayName: Yup.string().max(25, 'Display name must have max 25 characters'),
  email: Yup.string().email('Email not valid').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6')
    .max(30, 'Password too long')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password not match')
    .required('Confirm password is required'),
});

export default function SignUp() {
  const [register] = useMutation(M.REGISTER, {
    onCompleted: ({ register }) => {
      console.log(register);
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0]);
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<SignUpInput>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<SignUpInput> = (values) => {
    register({
      variables: { input: values },
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="displayName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    label="Display Name"
                    autoComplete="off"
                    autoFocus
                    error={!!errors.displayName}
                    helperText={
                      errors.displayName ? errors.displayName.message : null
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
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
                    helperText={
                      errors.password ? errors.password.message : null
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm password"
                    type="password"
                    autoComplete="off"
                    error={!!errors.confirmPassword}
                    helperText={
                      errors.confirmPassword
                        ? errors.confirmPassword.message
                        : null
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signin" component={NavLink} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
