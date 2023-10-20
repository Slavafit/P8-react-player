import React from "react";
import { Container, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import "./Contactos.css";

const WallPaper = styled('div')(({ theme }) => ({
  position: 'fixed',
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
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
}));

const Contactos = () => {
  const theme = useTheme();
  return (
    <div className="bgjar">
    <Container  theme={theme} >
      <Widget>
      <Typography className="text-center">
        <h3 className="display-5 mb-4 mt-0">About us</h3>
      </Typography>
      
      <Typography style={{ color: "inherit", fontFamily: "monospace", mr: 2 }}>
        <p>
          Cloud Music is an app for listening to music. On the main page you can
          search and listen to the song you have found. When registering the
          user will be sent information about his login and password, do not
          lose it. For registered users you can create your own lists, you can
          also add your favorite songs to these lists. In your personal cabinet
          you can change your personal data or delete your account. You can also
          edit and delete your song lists. <br />
          Public listening is prohibited! These audio files are for personal use
          only.
        </p>
      </Typography>
      </Widget>
      {/* <WallPaper /> */}
    </Container>
  </div>
  );
};

export default Contactos;
