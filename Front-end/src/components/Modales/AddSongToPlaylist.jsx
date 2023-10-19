import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { addTokenToHeaders } from "../../Service/authUser";
import axios from "axios";


function AddSongToPlaylist({ playlists, open, onClose, selectedSong }) {
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [serverResponse, setServerResponse] = useState("");

    const TinyText = styled(Typography)({
        fontSize: '0.8rem',
        opacity: 0.7,
        fontWeight: 500,
        letterSpacing: 0.2,
        marginTop: 4,
        fontFamily: 'monospace',
        display: 'flex',
        color: 'red'
      });


  // Обработчик выбора плейлиста
  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  // Обработчик добавления песни в выбранный плейлист
  const handleAddToPlaylist = async () => {
    if (selectedPlaylist) {
      try {
        addTokenToHeaders();
        const response = await axios.post(`http://localhost:5000/songtolist/?playlistId=${selectedPlaylist._id}`, {
            songId: selectedSong._id
        });
        // console.log(response.data.message);
        setServerResponse(response.data.message);
        setTimeout(() => {
        setServerResponse("");
        onClose();
        }, 1000);
      } catch (error) {
        console.error("Error adding song to the playlist", error);
        console.log(error.response.data.message);
        setServerResponse(error.response.data.message);
      }
    }
  };

  const handleCancel = () => {
    // Очистите состояние serverResponse при нажатии на "Cancel"
    setServerResponse("");
    onClose();
  };



  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>Add Song to Playlist</DialogTitle>
    <DialogContent>
    <TinyText>{serverResponse}</TinyText>
      <List>
        {playlists && playlists.map((playlist) => (
          <ListItem
            key={playlist._id}
            onClick={() => handlePlaylistSelect(playlist)}
            selected={selectedPlaylist === playlist}
          >
            <Link component="button"  underline="none" color="success" >
              <ListItemText primary={playlist.listName} />
            </Link>
          </ListItem>
        ))}
      </List>

    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={handleAddToPlaylist} color="primary">
        Add
      </Button>
    </DialogActions>
  </Dialog>
  );
}

export default AddSongToPlaylist;