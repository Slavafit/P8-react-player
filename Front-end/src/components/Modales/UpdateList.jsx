import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const DeletePlaylist = ({ open, close, onDelete, playlistName }) => {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Delete Playlist</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the playlist "{playlistName}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePlaylist;
