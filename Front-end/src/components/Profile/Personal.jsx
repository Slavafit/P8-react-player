import React, { useState, useEffect } from "react";
import { styled, useTheme, useMediaQuery } from "@mui/material";
import {
  Avatar, Box, Button, Container, Grid, Typography,
} from "@mui/material";;
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { fetchUsers } from "../../Service/Api";
import CssBaseline from "@mui/material/CssBaseline";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { addTokenToHeaders } from "../../Service/authUser";
import EditUserProfile from "../Modales/EditUserProfile";
import DeleteUserModal from "../Modales/DeleteUserModal";
import { useAuth } from "../../Service/AuthContext";
import Listitem from "../listItem";
import Swal from 'sweetalert2';

const WallPaper = styled("div")(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  overflow: "hidden",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(rgb(40, 0, 0) 0%, rgb(20, 0, 0) 100%)"
      : "linear-gradient(rgb(0, 255, 255) 0%, rgb(0, 128, 128) 100%)",
  transition: "all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s",
  "&:before": {
    content: '""',
    width: "140%",
    height: "140%",
    position: "absolute",
    top: "-40%",
    right: "-50%",
    background:
      theme.palette.mode === "dark"
        ? "radial-gradient(at center center, rgb(120, 0, 0) 0%, rgba(120, 0, 0, 0) 64%)"
        : "radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)",
  },
  "&:after": {
    content: '""',
    width: "140%",
    height: "140%",
    position: "absolute",
    bottom: "-50%",
    left: "-30%",
    background:
      theme.palette.mode === "dark"
        ? "radial-gradient(at center center, rgb(140, 0, 0) 0%, rgba(140, 0, 0, 0) 70%)"
        : "radial-gradient(at center center, rgb(255, 255, 0) 0%, rgba(255, 255, 0, 0) 70%)",
    transform: "rotate(30deg)",
  },
}));

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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);
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
          <Grid item xs={12} sm={3}>
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{ margin: 2 }}
                    onClick={() => setOpen(true)}
                    endIcon={<EditRoundedIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ margin: 2 }}
                    endIcon={<DeleteForeverRoundedIcon />}
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Widget>
          </Grid>
          {/* Блок с песнями */}
          <Grid item xs={12} sm={9}>
            <Widget>
              <Listitem
                userName={username}
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
        <WallPaper />
      </Container>
    </>
  );
};

export default ProfilePage;
