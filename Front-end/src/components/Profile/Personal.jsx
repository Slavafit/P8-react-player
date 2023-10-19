import React, { useState, useEffect } from "react";
import { styled, useTheme, useMediaQuery } from "@mui/material";
import {
  Avatar, Box, Container, Grid, Typography, IconButton,
} from "@mui/material";;
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { fetchUsers } from "../../Service/Api";
import CssBaseline from "@mui/material/CssBaseline";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import { addTokenToHeaders } from "../../Service/authUser";
import EditUserProfile from "../Modales/EditUserProfile";
import DeleteUserModal from "../Modales/DeleteUserModal";
import { useAuth } from "../../Service/AuthContext";
import Listitem from "../listItem";
import Swal from 'sweetalert2';
import Player from "../../components/Player/Player";


const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 15,
  // width: 400,
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
}));

const ProfilePage = () => {
  const [users, setUsers] = useState(true);
  let username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const [editOpen, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [lists, setLists] = useState([]); //принимаем и храним список для Player
  const [selectedList, setSelectedList] = useState(null); //принимаем и храним список для проигрывания

  // console.log("personal: ", selectedList);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      addTokenToHeaders();
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/personal/?username=${username}`
      );
      setUsers(response.data.user);
      // console.log(response.data.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };
  
  
    //блок удаления пользователя
    const handleDeleteUser = async () => {
      try {
        const id = users._id
        addTokenToHeaders();
        await axios.delete(`http://localhost:5000/users/?_id=${id}`);
        setDeleteOpen(false);
        logout();
        navigate('/');
      } catch (error) {
        console.error("Error delete user:", error);
      }
    };

  
    //метод редактирования
    const handleEditUser = async (newUsername, newEmail) => {
      try {
        const id = users._id
        const userData = {
          username: newUsername,
          email: newEmail,
        };
        addTokenToHeaders();
        setLoading(true);
        const response = await axios.put(
          `http://localhost:5000/users/?_id=${id}`, userData );
        
        setUsers(response.data);
        let username = response.data.username;
        let email = response.data.email;
        localStorage.setItem('username', username);
        setLoading(false);
        setOpen(false)
        showAlert(username, email)
      } catch (error) {
        setLoading(false);
        console.error("Error updating user:", error);
      }
    };
    
    // Функция для установки новых плейлистов
  const getPlaylists = (newPlaylists) => {
    setLists(newPlaylists);
  };
    // Функция обновления плейлистов
  const upPlaylists = (newPlaylists) => {
    setLists(newPlaylists);
  };

    function showAlert(username, email) {
      Swal.fire(
        `${username} and ${email}`,
        'successfully updated',
        'warning'
      )
    }  
  
  //блок ошибок загрузки
  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Container>
        <CssBaseline />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <Widget>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "primary.main",
                    // marginBottom: 2,
                  }}
                >
                  {users.username.charAt(0)}
                </Avatar>
                <Typography variant="h5" component="h1">
                  {users.username}
                </Typography>
                <Typography variant="subtitle1" component="p">
                  {users.email}
                </Typography>
                <Box>
                  <IconButton onClick={() => setOpen(true)}>
                    <EditRoundedIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteOpen(true)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Widget>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
              <Player
                playlists={lists}
                selectedList={selectedList}
                />
            </Box>
          </Grid>
          {/* Блок с песнями */}
          <Grid item xs={12} sm={4}>
            <Widget>
              <Listitem
                getPlaylists={getPlaylists} // передаем функцию получения листов
                upPlaylists={upPlaylists} // передаем функцию обновления листов
                onListSelect={setSelectedList}  //принимаем список листов
                />
            </Widget>
          </Grid>

        </Grid>
        <EditUserProfile
        editOpen={editOpen}
        handleClose={() => setOpen(false)}
        onSubmit={handleEditUser}
        initialUsername={users.username || ""}
        initialEmail={users.email || ""}
        />
        <DeleteUserModal
        deleteOpen={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteUser}
        />
      </Container>
    </>
  );
};

export default ProfilePage;
