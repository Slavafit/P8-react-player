import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import EditUsers from "../Modales/EditUsers"
import DeleteUser from "../Modales/DeleteUser"
import { addTokenToHeaders } from '../../Service/authUser';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      addTokenToHeaders();
      const response = await axios.get("https://p8-player-401107.ew.r.appspot.com/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  //показать окно редактирования
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  //закрыть окно редактирования
  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleSaveUser = async () => {
    try {
      addTokenToHeaders();
      await axios.put(`https://p8-player-401107.ew.r.appspot.com/users/?_id=${selectedUser._id}`, selectedUser);
      fetchUsers();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

    //модальное окно для удаления user
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDeleteIndex, setUserToDeleteIndex] = useState(null);

    //показать модальное окно
    const handleDeleteConfirmationShow = (user) => {
      setUserToDeleteIndex(user);
      setShowDeleteModal(true);
    };
    //закрыть модальное окно
    const handleDeleteConfirmationClose = () => {
      setShowDeleteModal(false);
      setUserToDeleteIndex(null);
    };
  //подтверждение удаления
    const handleDeleteUserConfirmed = () => {
      if (userToDeleteIndex !== null) {
        handleDeleteUser(userToDeleteIndex);
        handleDeleteConfirmationClose();
      }
    };

    //метод удаления delete
    const handleDeleteUser = async (user) => {
      try {
        addTokenToHeaders();
        await axios.delete(`https://p8-player-401107.ew.r.appspot.com/users/?_id=${user._id}`);
        fetchUsers();
        handleDeleteConfirmationClose();
      } catch (error) {
        console.error("Error delete user:", error);
      }
    };

  return (
    <Container border="primary">
      <h1>User control</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(', ')}</td>
              <td>
                <Button variant="warning" className="me-1"
                  onClick={() => handleEditUser(user)}>Edit</Button>
                <Button variant="danger"
                  onClick={() => handleDeleteConfirmationShow(user)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <EditUsers show={showEditModal}
       onHide={handleCloseEditModal}
       onSubmit={handleSaveUser}
       selectedUser={selectedUser}
       setSelectedUser={setSelectedUser}
       />

      <DeleteUser show={showDeleteModal}
       onHide={handleDeleteConfirmationClose}
       onSubmit={handleDeleteUserConfirmed}
       selectedUser={selectedUser}
       setSelectedUser={setSelectedUser}
       />
    </Container>
  );
};

export default UserManagement;
