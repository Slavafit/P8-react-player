import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/images/logo.png";

import {
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
} from "react-bootstrap";

const Header = () => {
  return (
    <>
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-transparent"
      // style={{ fontSize: '20px' }}
      >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="text-dark">
          <img src={logo} alt="Logo" className="d-inline-block" style={{ width: "64px" }} />
            mp3 Cloud
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            navbarScroll
          >
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="" >
              Test
            </Nav.Link>
            <Nav.Link as={NavLink} to="/Contactos" className="text-dark">
              About us
            </Nav.Link>
          </Nav>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  variant="outline-primary"
                  className="me-2"
                  aria-label="Search"
                />
              <Button variant="outline-primary">Search</Button>
            </Form>
          <Nav className="ms-3">
            <Button as={NavLink} to="/SignIn" variant="outline-primary" >
              Sign-In
            </Button>
            <Nav.Link as={NavLink} to="/SignIn"></Nav.Link>
                      
          </Nav>
          <Nav>
            <Button
              as={NavLink}
              to="/SignUp"
              variant="primary"
              className="ms-3"
              // size="sm"
            >
              Sign-Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
};

export default Header;
