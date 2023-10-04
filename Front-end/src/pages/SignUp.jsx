import React, { useState, useRef } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import "./sign.css";
import axios from "axios";
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';


function Register() {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const captcha = useRef(null);
  const [captchaValue, setCaptchaValue] = useState(null);

  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();// Предотвращаем отправку формы по умолчанию Impedir el envío de formularios de forma predeterminada
    const form = event.currentTarget;

    if (form.checkValidity() === false || formData.password !== confirmPassword || captchaValue === null) {
        event.stopPropagation();
        setValidated(true);
        return;
      } 

      try {
        const response = await axios.post(
          "http://localhost:5000/registration", formData);
        // let responseMessage = response.data.message;
        // console.log("Server response:", responseMessage);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        
        setValidated(true);
          // Вызываем функцию для отображения всплывающего уведомления
        showAutoCloseAlert(response.data.message);
        } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          console.error("Server error:", error.response);
        } else {
          console.error("Error sending data:", error);
          const resMessage = error.response.data.errors[0];
          showAutoCloseAlert(resMessage.message);
        }
      }
    
    form.reset();
    captcha.current.reset();
    setCaptchaValue(null);
    setValidated(true);
  };

  function showAutoCloseAlert(responseMessage) {
    let timerInterval;
  
    Swal.fire({
      icon: 'info',
      title: responseMessage,
      html: 'Please, check your data. It will be close in <b></b> ms.',
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector('b');
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        
      }
    });
  }
  

  

  return (
    <Container className="sign">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          <Row className="mb-1 mt-4 d-flex justify-content-center">
            <Form.Group as={Col} md="3">
              <Form.Label className="fs-5">Username</Form.Label>
              <Form.Control
                required
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
              <Form.Control.Feedback type="invalid">
                Please, provide a valid username.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom02">
              <Form.Label className="fs-5">Email</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
              />
              <Form.Control.Feedback type="invalid">
              Please, enter your valid email address.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3 d-flex justify-content-center">
            <Form.Group
              as={Col}
              md="3"
              className="p-3"
              controlId="validationCustom03"
            >
              <Form.Label className="fs-5">Password</Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              className="p-3"
              controlId="validationCustom04"
            >
              <Form.Label className="fs-5">Confirm password</Form.Label>
              <Form.Control
                  required
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm password"
                  isInvalid={formData.password !== confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
              Passwords do not match.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <ReCAPTCHA
            className="d-flex justify-content-center"
            ref={captcha}
            sitekey="6LcHSjEmAAAAADpYYDwgZFzzNw5nBlrt5VfXFiVc"
            onChange={(value) => setCaptchaValue(value)}
          />
          <Button type="submit" className="mt-4 text-center mx-auto d-block">
            Send
          </Button>
          <p className="mt-5 mb-3 text-center text-muted"> Music cloud © 2023</p>
        </Form>
      </Container>
  );
}

export default Register;
