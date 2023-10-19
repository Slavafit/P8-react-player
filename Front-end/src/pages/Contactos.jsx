import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Contactos = () => {
  return (
    <Container>
      <Container className="mt-5">
        <Row className="my-5">
          <Col>
            <div className="text-center">
              <h2 className="display-4 mb-4">About us</h2>
            </div>
            <p className="lead">
            Cloud Music is an app for listening to music. On the main page you can search and listen to the song you have found. When registering the user will be sent information about his login and password, do not lose it. For registered users you can create your own lists, you can also add your favorite songs to these lists. In your personal cabinet you can change your personal data or delete your account. You can also edit and delete your song lists. <br />
            Public listening is prohibited! These audio files are for personal use only.
            </p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Contactos;
