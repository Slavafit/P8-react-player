import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

const EditModal = ({ editOpen, editClose, onSubmit, initialListname }) => {
  const [listname, setListName] = useState(initialListname);

    // Обработчик изменения значения playlist
    const handleChange = (event) => {
      setListName(event.target.value);
    };

    useEffect(() => {
      // Обновить listname, когда initialListname изменяется
      setListName(initialListname);
    }, [initialListname]);

  return (
    <Dialog open={editOpen} onClose={editClose}>
      <DialogTitle>Edit playlist</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the new name:</DialogContentText>
        <TextField
        sx={{ margin: 1 }}
        label="List name" 
        fullWidth
        value={listname}
        onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={editClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onSubmit(listname)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;