import React from "react";
// import logo from "../../assets/images/logo.png";

// import { Container } from "react-bootstrap";

import "./footer.css";

const Footer = () => {
  return (
        <div className="container-grid footer">
          <div className="boxone mt-2">             
            {/* <img src={logo} alt="Logo" style={{ width: "80px" }} /> */}
          </div>

          <div className="boxtwo">
            <h4>Sobre Nosotros</h4>
            <ul>
              <li>Política de Privacidad</li>
            </ul>
          </div>
          <div className="boxtwo">
            <h4>Contáctanos</h4>
            <ul>
              <li>C/ de los Junior Fullstack, Mérida, 06800, España </li>
            </ul>
          </div>
        </div>
  );
};

export default Footer;
