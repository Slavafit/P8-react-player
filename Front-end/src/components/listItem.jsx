import React, { useState, useEffect} from "react";
import {
  Button,
  IconButton,
  List,
  ListItem as MuiListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { addTokenToHeaders } from "../Service/authUser";
import CssBaseline from "@mui/material/CssBaseline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddPlaylistModal from "./Modales/PostList";
import DeletePlaylistModal from "./Modales/DeleteList";
import EditListModal from "./Modales/EditList";
import Swal from 'sweetalert2';
// import AddSongToPlaylist from "./Modales/AddSongToPlaylist"

    
const Listitem = ({ userName, createPlaylist, deletePlaylist, updatePlaylist }) => {
  const [lists, setLists] = useState([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selDelList, setselDelList] = useState(null);


  //отображение листов GET
  useEffect(() => {
      fetchLists();
  }, []);

    const fetchLists = async () => {
        try {
        addTokenToHeaders();
        const response = await axios.get(
            `http://localhost:5000/playlist/?userName=${userName}`
        );
        // console.log(response);
        setLists(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
        console.error("Error fetching lists:", error);
        }
    };

    //добавление листа POST
    const handleAddPlaylist = async (playlistName) => {
      try {
        addTokenToHeaders();
        const response = await axios.post(`http://localhost:5000/playlist/?userName=${userName}`, {
          listName: playlistName
        });
        fetchLists();
        console.log('Playlist created:', response.data);
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
    
    
    //открытие мод. окна PUT
  const handleEditClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setOpenEditModal(true);
  };

  //метод PUT
  const handleEditPlaylist = async (listname) => {
    try {
      addTokenToHeaders();
      await axios.put(
        `http://localhost:5000/playlist/?_id=${selectedPlaylist._id}`, {
          listName: listname
      });      
      fetchLists();
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  //модальное окно DELETE
  const handleOpenDeleteModal = (playlist) => {
    setselDelList(playlist);
    setOpenDeleteModal(true);
  };

  //метод DELETE
  const handleDeletePlaylist = async (selectedPlaylist) => {
    try {
      addTokenToHeaders();
      await axios.delete(`http://localhost:5000/playlist/?_id=${selectedPlaylist._id}`);
      setOpenDeleteModal(false);
      fetchLists();
    } catch (error) {
      console.error("Error delete user:", error);
    }
  };

  function showAlert(errorMessage) {
    Swal.fire(
      `${errorMessage}`,
      'Error creating playlist',
      'warning'
    )
  }
  
  
  return (
    <>
    <CssBaseline />
    <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setAddOpen(true)}
      >
        Create Playlist
      </Button>
      <List>
        {lists.map((playlist) => (
          <MuiListItem key={playlist._id}>
            <ListItemText primary={playlist.listName}/>
            <IconButton onClick={() => handleEditClick(playlist)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteModal(playlist)}>
              <DeleteIcon />
            </IconButton>
          </MuiListItem>
        ))}
      </List>
      
      <AddPlaylistModal
        open={isAddOpen}
        close={() => setAddOpen(false)}
        onSubmit={handleAddPlaylist}
      />
      <EditListModal
        editOpen={openEditModal}
        editClose={() => setOpenEditModal(false)}
        onSubmit={handleEditPlaylist}
        // updatePlaylist={handleUpdatePlaylist}
        initialListname={selectedPlaylist ? selectedPlaylist.listName : ''}
      />
      <DeletePlaylistModal
      open={openDeleteModal}
      close={() => setOpenDeleteModal(false)}
      onDelete={() => handleDeletePlaylist(selDelList)}
      playlistName={selDelList ? selDelList.listName : ''}
      />
      {/* <AddSongToPlaylist
      lists={lists}
      /> */}
    </>
  );
};

export default Listitem;
