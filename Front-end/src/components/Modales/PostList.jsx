import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';


const AddPlaylistModal = ({ open, onSubmit, close }) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const handleAddClick = () => {
    if (playlistName.trim() !== '') {
      onSubmit(playlistName);
      close();
    }
  };


  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add Playlist</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the name of the new playlist:</DialogContentText>
        <TextField
          label="Playlist Name"
          fullWidth
          value={playlistName}
          onChange={handleNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddClick} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlaylistModal;
