import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  ListGroup,
  Button,
  } from "react-bootstrap";
import axios from "axios";
import "./AdminPanel.css";
import TablaUsers from "../components/Tables/TablaUsers";
import TablaAdvan from "../components/Tables/TablaAdvan";
import TopButton from "../components/TopButton/TopButton";
import Header from "../components/Header/Header";
import AddModalCours from "../components/Modales/AddModalCours";
import DeleteModalCours from "../components/Modales/DeleteModalCours";
import EditModalCours from "../components/Modales/EditModalCours";
import "./Registrar.css";

function CoursList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [Songdata, setSongdata] = useState([]);
  //модальное окно добавления -ventana modal añadir
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewSong] = useState({
    id: "",
    cover: "",
    title: "",
    price: "",
    time: "",
    desc: "",
  });
  //модальное окно редактирования -ventana modal modificar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourseIndex, setEditCourseIndex] = useState(null);
  const [editedCourse, setEditedCourse] = useState({
    cover: "",
    title: "",
    price: "",
    time: "",
    desc: "",
  });

  const handleEditCourse = (index) => {
    setEditCourseIndex(index);
    setEditedCourse(Songdata[index]);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditCourseIndex(null);
    setEditedCourse({
      cover: "",
      title: "",
      price: "",
      time: "",
      desc: "",
    });
  };

  const handleSaveEditedCourse = async () => {
    try {
      const courseIdToEdit = Songdata[editCourseIndex].id; // Assuming each course has an "id" field
      await axios.put(
        `http://localhost:5000/course/${courseIdToEdit}`,
        editedCourse
      );
      const updatedCourses = [...Songdata];
      updatedCourses[editCourseIndex] = editedCourse;
      setSongdata(updatedCourses);
      handleEditModalClose();
    } catch (error) {
      console.error("Error saving edited course:", error);
    }
  };

  //отображение карточек курсов - mostrar tarjetitos
  useEffect(() => {
    axios
      .get("http://localhost:5000/course")
      .then((response) => {
        setSongdata(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);
  //открытие -
  const handleAddModalShow = () => {
    setShowAddModal(true);
  };
  //и закрытие модального окна
  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  //метод post для добавления новой карточки
  const handleAddCourse = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/course",
        newCourse
      );
      const addedSong = response.data;
      setSongdata([...Songdata, addedSong]);
      setNewSong({ id, title: "", desc: "", price: "", time: "", cover: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };
  //модальное окно для удаления карточки
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [songToDeleteIndex, setsongToDeleteIndex] = useState(null);

  const handleDeleteConfirmationShow = (index) => {
    setsongToDeleteIndex(index);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setShowDeleteConfirmation(false);
    setsongToDeleteIndex(null);
  };

  const handleDeleteCourseConfirmed = () => {
    if (songToDeleteIndex !== null) {
      handleDeleteSong(songToDeleteIndex);
      handleDeleteConfirmationClose();
    }
  };

  const handleDeleteSong = async (index) => {
    try {
      const songIdToDelete = Songdata[index].id; // Assuming each course has an "id" field
      await axios.delete(`http://localhost:5000/course/${songIdToDelete}`);
      const updatedSongs = [...Songdata];
      updatedSongs.splice(index, 1);
      setSongdata(updatedSongs);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container className="registrar">
      <Header />
      <h1>Gestión de courses</h1>
      <Button
        className="mt-4 text-center mx-auto d-block"
        variant="primary"
        onClick={handleAddModalShow}
      >
        Añadir nuevo
      </Button>
      <Row className="d-flex justify-content-center">
        {Songdata.map((value, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3} className="mt-3">
            <Card
              style={{
                width: "15rem",
                boxShadow: "0 5px 8px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Card.Img variant="top" src={value.cover} />
              <Card.Body>
                <Card.Title>{value.title}</Card.Title>
                <Card.Text>{value.desc}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>El precio: {value.price} €</ListGroup.Item>
                <ListGroup.Item>Duración: {value.time} horas</ListGroup.Item>
              </ListGroup>
              <Card.Body className="d-flex justify-content-between">
                <Button
                  variant="warning"
                  className="me-5"
                  onClick={() => handleEditCourse(index)}
                >
                  Modificar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteConfirmationShow(index)}
                >
                  Borrar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* bloque modal ventanas */}
      {/* modal añadir */}
      <AddModalCours
        show={showAddModal}
        onHide={handleAddModalClose}
        onSubmit={handleAddCourse}
        newCourse={newCourse}
        setNewSong={setNewSong}
      />

      {/* modal modificar */}
      <EditModalCours
        show={showEditModal}
        onHide={handleEditModalClose}
        onSubmit={handleSaveEditedCourse}
        editCourseIndex={editCourseIndex}
        editedCourse={editedCourse}
        setEditedCourse={setEditedCourse}
      />

      {/* modal eliminar courses*/}
      <DeleteModalCours
        show={showDeleteConfirmation}
        onHide={handleDeleteConfirmationClose}
        onConfirm={handleDeleteCourseConfirmed}
      />
      <TablaUsers />
      <TablaAdvan />
      <TopButton />
    </Container>
  );
}

export default CoursList;
