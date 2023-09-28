import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, onHide, onSubmit, editedSong, setEditedSong }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar tarjetita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form>
          <Form.Group controlId="Enter artist">
              <Form.Label>Artist</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter an artist"
                value={editedSong.artist}
                onChange={(e) =>
                  setEditedSong({ ...editedSong, artist: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="track">
              <Form.Label>Track</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                placeholder="Enter name of the track"
                value={editedSong.track}
                onChange={(e) =>
                  setEditedSong({ ...editedSong, track: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="year">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                placeholder="Year:"
                value={editedSong.year}
                onChange={(e) =>
                  setEditedSong({ ...editedSong, year: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="fileUrl">
              <Form.Label>FileUrl</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter fileUrl:"
                value={editedSong.fileUrl}
                onChange={(e) =>
                  setEditedSong({ ...editedSong, fileUrl: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="coverUrl">
              <Form.Label>coverUrl</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter coverUrl"
                value={editedSong.coverUrl}
                onChange={(e) =>
                  setEditedSong({ ...editedSong, coverUrl: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                placeholder="Enter category"
                value={editedSong.category}
                onChange={(e) =>
                  setEditedSong({ ...editedSong, category: e.target.value })
                }
              >
              <option value="pop">Pop</option>
              <option value="dance">Dance</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Сancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
