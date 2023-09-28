import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, onHide, onSubmit, selectedUser, setSelectedUser }) => {
  return (
    <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Modificar</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={selectedUser ? selectedUser.name : ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                name: e.target.value,
              })
            }
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={selectedUser ? selectedUser.email : ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                email: e.target.value,
              })
            }
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={selectedUser ? selectedUser.password : ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                password: e.target.value,
              })
            }
          />
        </Form.Group>
        <Form.Group controlId="formBasicRole">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={selectedUser ? selectedUser.role : ""}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                role: e.target.value,
              })
            }
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </Form.Control>
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Cerrar
      </Button>
      <Button variant="primary" onClick={onSubmit}>
        Guardar
      </Button>
    </Modal.Footer>
  </Modal>
  );
};


    export default EditModal;