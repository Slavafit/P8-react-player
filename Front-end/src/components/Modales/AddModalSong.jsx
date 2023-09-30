import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddModal = ({ show, onHide, onSubmit, newSong, setNewSong }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add song</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Artist</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter artist"
                value={newSong.artist}
                onChange={(e) =>
                  setNewSong({ ...newSong, artist: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="track">
              <Form.Label>Track</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                placeholder="Enter track"
                value={newSong.track}
                onChange={(e) =>
                  setNewSong({ ...newSong, track: e.target.value })
                }
              />
              </Form.Group>
            <Form.Group controlId="year">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="text"
                rows={3}
                placeholder="Year"
                value={newSong.year}
                onChange={(e) =>
                  setNewSong({ ...newSong, year: e.target.value })
                }
              />
              </Form.Group>
              <Form.Group controlId="FileUrl">
              <Form.Label>FileUrl</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="FileUrl:"
                value={newSong.fileUrl}
                onChange={(e) =>
                  setNewSong({ ...newSong, fileUrl: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="CoverURL">
              <Form.Label>CoverURL</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter cover URL"
                value={newSong.coverUrl}
                onChange={(e) =>
                  setNewSong({ ...newSong, coverUrl: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={newSong.category}
                  onChange={(e) => {
                    const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
                    setNewSong({
                      ...newSong,
                      category: selectedOptions
                    });
                  }}
                >
                  <option value="pop">pop</option>
                  <option value="dance">dance</option>
                  <option value="rock">rock</option>
                  <option value="other">other</option>
                </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Add song
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddModal;
