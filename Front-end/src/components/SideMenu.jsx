import React from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

import AvatarMenu  from "./AvatarMenu";
import logo from "../assets/images/logo.png";
import SignInButton from './SignInButton';
import { useAuth } from "../Service/AuthContext";
import SwitchTheme from "./switch";

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // необходимо, чтобы контент находился под панелью приложения
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function SideMenu() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);   
  const { auth } = useAuth();



  return (
    <>
   <Box sx={{ flexGrow: 1 }} >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ ml: 5 }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }} >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', 
            fontFamily: 'monospace', mr: 2, display: { xs: 'none', md: 'flex' } }}>
            <img src={logo} alt="logo Cloud music" style={{ width: '48px', height: 'auto' }} />
            Cloud music
            </Link>
          </Typography>
          <SwitchTheme/>

          <div style={{ marginRight: '10px' }}>
            {auth && <AvatarMenu />}
          </div>
          <div style={{ marginRight: '10px' }}>
            <SignInButton
            auth={auth}
             />
          </div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={() => setOpen(true)}
            sx={{ ...(open && { display: 'none' }) }}
            >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open}>
        <DrawerHeader />
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
      
        <List>
          {[
            { text: 'Home', link: '/' },
            { text: 'Collection', link: '/personal' },
          ].map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.link}>
                <ListItemIcon>
                  {index % 2 === 0 ? <HouseOutlinedIcon /> : <LibraryMusicOutlinedIcon />}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[
            { text: 'Sign In', link: '/signin' },
            { text: 'About us', link: '/contactos' },
          ].map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.link}>
                <ListItemIcon>
                  {index % 2 === 0 ? <LoginRoundedIcon /> : <HelpOutlineOutlinedIcon />}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
    </>
  );
}
