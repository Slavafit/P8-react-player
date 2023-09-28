import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./Contactos.css";

const Contactos = () => {
  return (
    <Container>
      <Header />
      <Container className="mt-5">
        <Row className="my-5">
          <Col>
            <div className="text-center">
              <h2 className="display-4 mb-4">Sobre nosotros</h2>
            </div>
            <p className="lead">
              Bienvenidos a CoursDev, una plataforma de aprendizaje en línea
              dedicada a proporcionar cursos de alta calidad sobre desarrollo de
              software y tecnología. Nuestro objetivo es ayudarte a adquirir
              nuevas habilidades y conocimientos en campos como la programación,
              el diseño web, la ciencia de datos y mucho más.
            </p>
            <p className="lead">
              Nuestros instructores son profesionales experimentados en la
              industria que están comprometidos con brindarte contenido
              educativo relevante y actualizado. Ya sea que estés buscando
              mejorar tus habilidades existentes o explorar nuevas áreas,
              encontrarás una amplia variedad de cursos en nuestra plataforma.
            </p>
            <p className="lead">
              Estamos dedicados a brindarte una experiencia de aprendizaje
              excepcional. ¡Esperamos que disfrutes de tu tiempo en CoursDev y
              te deseamos mucho éxito en tu viaje de aprendizaje!
            </p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default Contactos;
