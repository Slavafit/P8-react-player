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
import TablaLists from "../components/Tables/TablaLists";
import TopButton from "../components/TopButton/TopButton";
import Header from "../components/Header/Header";
import AddModalSong from "../components/Modales/AddModalSong";
import DeleteModalSong from "../components/Modales/DeleteModalSong";
import EditModalSong from "../components/Modales/EditModalSong";
import "./Registrar.css";

function SongsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [Songdata, setSongdata] = useState([]);
  //модальное окно добавления
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSong, setNewSong] = useState({
    id: "",
    artist: "",
    track: "",
    year: "",
    fileUrl: "",
    coverUrl: "",
    category: "",
  });
  //модальное окно редактирования
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSongIndex, seteditSongIndex] = useState(null);
  const [editedSong, setEditedSong] = useState({
    cover: "",
    title: "",
    price: "",
    time: "",
    desc: "",
  });

  const handleEditSong = (index) => {
    seteditSongIndex(index);
    setEditedSong(Songdata[index]);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    seteditSongIndex(null);
    setEditedSong({
      artist: "",
      track: "",
      year: "",
      fileUrl: "",
      coverUrl: "",
      category: "",
    });
  };
  //метод редактирования
  const handleSaveEditedSong = async () => {
    try {
      const songIdToEdit = Songdata[editSongIndex].id; // Assuming each song has an "id" field
      await axios.put(
        `http://localhost:5000/songs/${songIdToEdit}`,
        editedSong
      );
      const updatedSongs = [...Songdata];
      updatedSongs[editSongIndex] = editedSong;
      setSongdata(updatedSongs);
      handleEditModalClose();
    } catch (error) {
      console.error("Error saving edited songs:", error);
    }
  };

  //отображение карточек курсов - mostrar tarjetitos
  useEffect(() => {
    axios
      .get("http://localhost:5000/songs")
      .then((response) => {
        setSongdata(response.data);
        setLoading(false);            //отображение ожидания загрузки
      })
      .catch((error) => {
        setError(error);
        setLoading(false);            //ошибка загрузки
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
  const handleAddSong = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/songs",
        newSong
      );
      const addedSong = response.data;
      setSongdata([...Songdata, addedSong]);
      setNewSong({ id, artist: "", track: "", year: "", fileUrl: "", coverUrl: "", category: "" });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding songs:", error);
    }
  };

  //модальное окно для удаления карточки
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [songToDeleteIndex, setSongToDeleteIndex] = useState(null);
//показать модальное окно
  const handleDeleteConfirmationShow = (index) => {
    setSongToDeleteIndex(index);
    setShowDeleteConfirmation(true);
  };
//закрыть модальное окно
  const handleDeleteConfirmationClose = () => {
    setShowDeleteConfirmation(false);
    setSongToDeleteIndex(null);
  };
//подтверждение удаления
  const handleDeleteSongConfirmed = () => {
    if (songToDeleteIndex !== null) {
      handleDeleteSong(songToDeleteIndex);
      handleDeleteConfirmationClose();
    }
  };
  //метод удаления delete
  const handleDeleteSong = async (index) => {
    try {
      const songIdToDelete = Songdata[index].id; // удаления карточки по "id"
      await axios.delete(`http://localhost:5000/songs/${songIdToDelete}`);
      const updatedSongs = [...Songdata];
      updatedSongs.splice(index, 1);
      setSongdata(updatedSongs);
    } catch (error) {
      console.error("Error deleting songs:", error);
    }
  };

  //блок ошибок загрузки
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container className="registrar">
      <Header />
      <h1>Songs control</h1>
      <Button
        className="mt-4 text-center mx-auto d-block"
        variant="primary"
        onClick={handleAddModalShow}
        >
        Add new
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
              <Card.Img variant="top" src={value.coverUrl} />
              <Card.Body>
                <Card.Title>Artist: {value.artist}</Card.Title>
                <Card.Text>Track: {value.track}</Card.Text>
                <Card.Text>Year: {value.year}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>FileUrl: {value.fileUrl}</ListGroup.Item>
                <ListGroup.Item>Category: {value.category}</ListGroup.Item>
              </ListGroup>
              <Card.Body className="d-flex justify-content-between">
                <Button
                  variant="warning"
                  className="me-5"
                  onClick={() => handleEditSong(index)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteConfirmationShow(index)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* блок модальных окон */}
      {/* окно добавления */}
      <AddModalSong
        show={showAddModal}
        onHide={handleAddModalClose}
        onSubmit={handleAddSong}
        newSong={newSong}
        setNewSong={setNewSong}
      />

      {/* окно изменения */}
      <EditModalSong
        show={showEditModal}
        onHide={handleEditModalClose}
        onSubmit={handleSaveEditedSong}
        editSongIndex={editSongIndex}
        editedSong={editedSong}
        setEditedSong={setEditedSong}
      />

      {/* окно удаления*/}
      <DeleteModalSong
        show={showDeleteConfirmation}
        onHide={handleDeleteConfirmationClose}
        onConfirm={handleDeleteSongConfirmed}
      />
      <TablaUsers />
      <TablaLists />
      <TopButton />
    </Container>
  );
}

export default SongsList;
