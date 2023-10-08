import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';

import logo from "../assets/images/logo.png";
import { authUser } from '../Service/authUser';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Service/AuthContext';


const WallPaper = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(rgb(40, 0, 0) 0%, rgb(20, 0, 0) 100%)'
    : 'linear-gradient(rgb(0, 255, 255) 0%, rgb(0, 128, 128) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&:before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(at center center, rgb(120, 0, 0) 0%, rgba(120, 0, 0, 0) 64%)'
      : 'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
  },
  '&:after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(at center center, rgb(140, 0, 0) 0%, rgba(140, 0, 0, 0) 70%)'
      : 'radial-gradient(at center center, rgb(255, 255, 0) 0%, rgba(255, 255, 0, 0) 70%)',
    transform: 'rotate(30deg)',
  },
}));

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 15,
  width: 400,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));


const TinyText = styled(Typography)({
  fontSize: '1rem',
  opacity: 0.6,
  fontWeight: 500,
  letterSpacing: 0.3,
  marginTop: 6,
  fontFamily: 'monospace',
  display: 'flex'
});

export default function SignIn() {
  const theme = useTheme();
  // const isAuthenticated = useEffect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  
    useEffect(() => {
    // При монтировании компонента, проверьте, есть ли сохраненные данные в localStorage
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
    }, []);

     // Эффект для отслеживания изменений в поле email
  useEffect(() => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsEmailValid(emailPattern.test(email));
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const isAuthenticated = await authUser(email, password);

      if (isAuthenticated) {
        // Сохраняем данные пользователя, если "Remember Me" отмечено
        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        } else {
          // Если "Remember Me" не отмечено, удаляем данные из localStorage
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }
        login();
        // В случае успешной аутентификации, перенаправьте пользователя
        navigate('/'); // Замените '/AdminPanel' на нужный URL

      } else {
        // Обработайте ошибку, например, выведите сообщение об ошибке на странице
        console.log("not Authenticated");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Container theme={theme} component="main" maxWidth="xs">
      <Widget>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          >
          <img src={logo} alt="Logo" height="64" />
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isEmailValid ? (
              <TinyText sx={{ color: 'green' }}>
                Email address is valid.
              </TinyText>
            ) : (
              <TinyText sx={{ color: 'red' }}>
                Please, enter a valid email address.
              </TinyText>
            )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isEmailValid || !email || !password} 
              >
                Sign In
              </Button>
              <Grid container>
              {/* <Grid item xs>
                <Link to="/Contactos" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link to="/SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Typography sx={{
            marginTop: 5,
            textAlign: "center",
            fontFamily: 'monospace',
            opacity: 0.8
          }}>Cloud music © 2023</Typography>
      </Widget>    
      <WallPaper />
    </Container>
  );
}
