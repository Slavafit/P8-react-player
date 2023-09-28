import React, { useState, useEffect } from "react";
import { Container, Table, Button, } from "react-bootstrap";
import axios from "axios";
import EditList from "../Modales/EditList"

const ListManagement = () => {
  const [list, setCategory] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get("http://localhost:5000/lists");
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedList(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedList(null);
    setShowEditModal(false);
  };

  const handleSaveList = async () => {
    try {
      await axios.put(`http://localhost:5000/lists/${selectedList.id}`, selectedList);
      fetchLists();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  return (
    <Container border="primary">
      <h1>List control</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Desc</th>
            <th>Cover</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.title}</td>
              <td>{user.desc}</td>
              <td>{user.cover}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditUser(user)}>Modificar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <EditList show={showEditModal}
       onHide={handleCloseEditModal}
       onSubmit={handleSaveList}
       selectedList={selectedList}
       setSelectedList={setSelectedList}
       />
       </Container>
  );
};

export default ListManagement;
