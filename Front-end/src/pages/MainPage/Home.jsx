import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Player from "../../components/Player/Player";
import TopButton from "../../components/TopButton/TopButton";

const Home = () => {

  return (
    <>
    <Container >
          {/* <Row> */}
            {/* <Col> */}
              <Player />
            {/* </Col> */}
          {/* </Row> */}
          <TopButton/>
    </Container>
    </>
  );
};

export default Home;
