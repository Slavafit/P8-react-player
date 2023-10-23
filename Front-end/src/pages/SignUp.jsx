import React, { useState, useRef } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import logo from "../assets/images/logo.png";
import axios from "axios";
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";


const WallPaper = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '110%',
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
  padding: 15,
  borderRadius: 15,
  width: 550,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
}));

const TinyText = styled(Typography)({
  fontSize: '0.9rem',
  opacity: 0.7,
  fontWeight: 500,
  letterSpacing: 0.2,
  marginTop: 4,
  fontFamily: 'monospace',
  display: 'flex'
}); 

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const captcha = useRef(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessages({
      ...errorMessages,
      [name]: "", // Сбрасываем сообщение об ошибке при изменении поля
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    const form = event.currentTarget;
  
    // Проверяем на пустые поля и устанавливаем сообщения об ошибках при необходимости
    let hasErrors = false;
    const newErrorMessages = { ...errorMessages };
  
    if (formData.username.trim() === "") {
      newErrorMessages.username = "Please provide a username.";
      hasErrors = true;
    }
  
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrorMessages.email = "Please provide an email address.";
      hasErrors = true;
    }
  
    if (formData.password.trim() === "") {
      newErrorMessages.password = "Please provide a password.";
      hasErrors = true;
    }
  
    if (formData.password !== formData.confirmPassword) {
      newErrorMessages.confirmPassword = "Passwords do not match.";
      hasErrors = true;
    }
   
    

    setErrorMessages(newErrorMessages); // Обновляем сообщения об ошибках
    
    if (captchaValue === null || captchaValue === "") {
      // Проверяем, что капча не пуста или не равна null
      hasErrors = true;
      // Устанавливаем сообщение об ошибке для капчи
      newErrorMessages.captcha = "Please complete the captcha.";
    }

    if (!hasErrors) {
      try {
        const response = await axios.post(
          "https://p8-player-401107.ew.r.appspot.com/registration",
          formData
        );
        let responseMessage = response.data.message;
        console.log("Server response:", responseMessage);
        // Очистка формы и других состояний
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
  
        // Вызываем функцию для отображения всплывающего уведомления
        showAutoCloseAlert(response.data.message);
      } catch (error) {
        if (error.response.data.message) {
          console.error("Server error:", error.response);
          let responseMessage = error.response.data.message;
          showAutoCloseAlert(responseMessage);
        } else {
          console.error("Error sending data:", error);
          const resMessage = error.response.data.errors[0];
          showAutoCloseAlert(resMessage.message);
        }
      }
    }
  
    form.reset();
    captcha.current.reset();
    setCaptchaValue(null);
  };
  

  function showAutoCloseAlert(responseMessage) {
    let timerInterval;
  
    Swal.fire({
      icon: 'info',
      title: responseMessage,
      html: 'Please, check your data. It will be close in <b></b> ms.',
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector('b');
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
        navigate('/signin');
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        
      }
    });
  }

  return (
    <>
      <Widget>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={logo} alt="Logo" height="64" />
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  autoComplete="given-name"
                  name="username"
                  label="User Name"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errorMessages.username}
                  helperText={
                  errorMessages.username ? (
                      <TinyText sx={{ color: 'red' }}>{errorMessages.username}</TinyText>
                    ) : (
                      <TinyText sx={{ color: 'green' }}>
                        Please provide a username.
                      </TinyText>
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errorMessages.email}
                  helperText={
                    errorMessages.email ? (
                        <TinyText sx={{ color: 'red' }}>{errorMessages.email}</TinyText>
                      ) : (
                        <TinyText sx={{ color: 'green' }}>
                          Please provide a Email.
                        </TinyText>
                      )
                    }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errorMessages.password}
                  helperText={
                  errorMessages.password ? (
                        <TinyText sx={{ color: 'red' }}>{errorMessages.password}</TinyText>
                      ) : (
                        <TinyText sx={{ color: 'green' }}>
                          Please provide a password.
                        </TinyText>
                      )
                    }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errorMessages.confirmPassword}
                  helperText={
                    errorMessages.confirmPassword ? (
                        <TinyText sx={{ color: 'red' }}>{errorMessages.confirmPassword}</TinyText>
                      ) : (
                        <TinyText sx={{ color: 'green' }}>
                          Please provide a confirm Password.
                        </TinyText>
                      )
                    }
                />
              </Grid>
            </Grid>
            <Box sx={{
                marginTop: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}>
                <ReCAPTCHA
                ref={captcha}
                sitekey="6LcHSjEmAAAAADpYYDwgZFzzNw5nBlrt5VfXFiVc"
                onChange={(value) => setCaptchaValue(value)}
                />
            </Box>
            <TinyText sx={{ color: 'red' }}>{errorMessages.captcha}</TinyText>
            <Grid item xs={12} sm={6} 
                sx={{ mt: 2, mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}
                >
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Grid>
          </Box>
        </Box>
          <Grid item sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end'}}>
                <Link to="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
        <Typography sx={{
            marginTop: 5,
            textAlign: "center",
            fontFamily: 'monospace',
            opacity: 0.8
          }}>Cloud music © 2023
        </Typography>
      </Widget>
      <WallPaper />
    </>
  )
}
