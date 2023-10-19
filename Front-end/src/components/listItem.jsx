import React, { useState, useEffect} from "react";
import {
  Button,
  IconButton,
  ListItem as MuiListItem,
  ListItemText,
  Typography,
  Container,
  Box,
  Link,
} from "@mui/material";
import axios from "axios";
import { addTokenToHeaders } from "../Service/authUser";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddPlaylistModal from "./Modales/PostList";
import DeletePlaylistModal from "./Modales/DeleteList";
import EditListModal from "./Modales/EditList";
import DelSongPlaylist from "./Modales/DelSongPlaylist";
import Swal from 'sweetalert2';

   
const Listitem = ({ createPlaylist, deletePlaylist, onListSelect, getPlaylists }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selDelList, setselDelList] = useState(null);
  const [openDeleteSong, setOpenDeleteSong] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  let userId = localStorage.getItem("userId");
  
  //отображение листов GET
  useEffect(() => {
    fetchPlaylists();
  }, []);

    const fetchPlaylists  = async () => {
        try {
        addTokenToHeaders();
        const response = await axios.get(
            `http://localhost:5000/songslist/?_id=${userId}`
        );
        const fetchedPlaylists = response.data.playlists;
        setPlaylists(fetchedPlaylists);
        getPlaylists(fetchedPlaylists); //передаю листы в Personal
        } catch (error) {
        console.error("Error fetching playlists:", error);
        }
    };

    //добавление листа POST
    const handleAddPlaylist = async (playlistName) => {
      try {
        addTokenToHeaders();
        const response = await axios.post(`http://localhost:5000/playlist/?_id=${userId}`, {
          listName: playlistName
        });
        setTimeout(() => {
          fetchPlaylists();
          }, 2000);
        console.log('Playlist created:', response.data.message);
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data.message;
          showAlert(errorMessage);
          console.error('Error creating playlist:', error);
        } else {
          console.error('Network error:', error);
        }
      }
    };
    
    
    //список открытие мод. окна PUT
  const handleEditClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setOpenEditModal(true);
  };

  //лист метод PUT
  const handleEditPlaylist = async (listname) => {
    try {

      addTokenToHeaders();
      await axios.put(
        `http://localhost:5000/playlist/?_id=${selectedPlaylist._id}`, {
          listName: listname
      });      
      fetchPlaylists();
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  //лист открытие модальное окно DELETE
  const handleOpenDeleteModal = (playlist) => {
    setselDelList(playlist);
    setOpenDeleteModal(true);
  };

  //лист метод DELETE
  const handleDeletePlaylist = async (selectedPlaylist) => {
    try {
      addTokenToHeaders();
      // console.log(selectedPlaylist);
      const response = await axios.delete(
        `http://localhost:5000/playlist/?_id=${selectedPlaylist._id}`);
      setOpenDeleteModal(false);
      fetchPlaylists();
      
      console.log('Playlist deleted:', response.data);
    } catch (error) {
      console.error("Error delete user:", error);
    }
  };

  //трэк удаление
  const handleOpenDeleteSong = (playlist, song) => {
    const dataToDelete = {
      playlist: playlist,
      song: song,
    };
    setSelectedSong(dataToDelete);
    setOpenDeleteSong(true);
  };

  const handleCloseDeleteSong = () => {
    setOpenDeleteSong(false);
    setSelectedSong(null);
  };

  const handleDeleteSong = async (dataToDelete) => {
    try {
      addTokenToHeaders();
      const playlist = dataToDelete.playlist;
      const song = dataToDelete.song;
      const response = await axios.delete(
        `http://localhost:5000/songslist/?playlistId=${playlist._id}&songId=${song._id}`);
      handleCloseDeleteSong();
      setTimeout(() => {
        fetchPlaylists();
        }, 2000);
      console.log(response.data.message);
      showAlert(response.data.message)
    } catch (error) {
      console.error("Error delete song form playlist:", error);
    }
    
  };


  function showAlert(errorMessage) {
    Swal.fire(
      `${errorMessage}`,
      'warning'
    )
  }
  
  
  return (
    <>
    <Button
        variant="outlined"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={() => setAddOpen(true)}
      >
        Create Playlist
      </Button>
      {playlists.map((playlist) => (
      <MuiListItem key={playlist._id} >
        <Box display="flex" flexDirection="column" >
          <Box display="flex" flexDirection="row" alignItems="center">
            <Link component="button"  underline="none">
            <Typography variant="h6" component="h1"
                // обработчик клика и передача playlist
                onClick={() => {
                  if (playlist.songs.length > 0) {  //проверка на наличие песен в списке
                    onListSelect(playlist.songs);
                  }
                }}>
              {playlist.listName}
            </Typography>
            </Link>
            <IconButton sx={{ ml: 6 }} onClick={() => handleEditClick(playlist)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteModal(playlist)}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column">
            {playlist.songs.map((song) => (
              <Box key={song._id} display="flex" flexDirection="row" alignItems="center">
                <ListItemText primary={song.artist} secondary={song.track} />
                <IconButton size="small" onClick={() => handleOpenDeleteSong(playlist, song)}>
                  <DeleteIcon fontSize="inherit"/>
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </MuiListItem>
      ))}
      <AddPlaylistModal
        open={isAddOpen}
        close={() => setAddOpen(false)}
        onSubmit={handleAddPlaylist}
      />
      <EditListModal
        editOpen={openEditModal}
        editClose={() => setOpenEditModal(false)}
        onSubmit={handleEditPlaylist}
        initialListname={selectedPlaylist ? selectedPlaylist.listName : ''}
      />
      <DeletePlaylistModal
      open={openDeleteModal}
      close={() => setOpenDeleteModal(false)}
      onDelete={() => handleDeletePlaylist(selDelList)}
      playlistName={selDelList ? selDelList.listName : ''}
      />
      <DelSongPlaylist
      open={openDeleteSong}
      onClose={handleCloseDeleteSong}
      onDelete={() => handleDeleteSong(selectedSong)}
      />
    </>
  );
};

export default Listitem;
