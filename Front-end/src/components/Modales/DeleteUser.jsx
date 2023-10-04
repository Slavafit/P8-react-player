import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteUserModal = ({ show, onHide, onSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} style={{ marginTop: '50px' }}>
      <Modal.Header closeButton>
        <Modal.Title>Delete user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Confirm delete</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onSubmit}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;
