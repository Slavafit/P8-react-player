import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, onHide, onSubmit, selectedList, setSelectedList }) => {
  return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Modificar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={selectedList ? selectedList.title : ""}
                onChange={(e) =>
                  setSelectedList({
                    ...selectedList,
                    title: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Desc</Form.Label>
              <Form.Control
                type="text"
                value={selectedList ? selectedList.desc : ""}
                onChange={(e) =>
                  setSelectedList({
                    ...selectedList,
                    desc: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Cover</Form.Label>
              <Form.Control
                type="text"
                value={selectedList ? selectedList.cover : ""}
                onChange={(e) =>
                  setSelectedList({
                    ...selectedList,
                    cover: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
  );
};


    export default EditModal;