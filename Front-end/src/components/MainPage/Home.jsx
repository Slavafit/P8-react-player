import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../Header/Header";
import SongsCard from "../SongsCard/SongsCard";
import Footer from "../Footer/Footer";
import "./Home.css";
import TopButton from "../TopButton/TopButton"

const Home = () => {

  return (
    <>
    <Container >
      <Header />
          <Row>
            <Col>
              <SongsCard />
            </Col>
          </Row>
          <TopButton/>
        {/* <Footer /> */}
    </Container>
    </>
  );
};

export default Home;
