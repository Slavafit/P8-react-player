import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import EditUsers from "../Modales/EditUsers"

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleSaveUser = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${selectedUser.id}`, selectedUser);
      fetchUsers();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Container border="primary">
      <h1>User control</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditUser(user)}>Modificar</Button>
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
    </Container>
  );
};

export default UserManagement;
