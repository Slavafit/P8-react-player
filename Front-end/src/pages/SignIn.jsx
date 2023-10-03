import React, { useState } from "react";
import { Form, Button, Col, Container } from "react-bootstrap";
import logo from "../assets/images/logo.png";
import { authUser } from '../Service/authUser';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Service/AuthContext';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const isAuthenticated = await authUser(email, password);

      if (isAuthenticated) {
        // Сохраняем данные пользователя, если "Remember Me" отмечено
        if (rememberMe) {
          localStorage.setItem('email', email);
          localStorage.setItem('password', password);
        } else {
          // Если "Remember Me" не отмечено, удаляем данные из localStorage
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }
        login();
        // В случае успешной аутентификации, перенаправьте пользователя
        navigate('/'); // Замените '/AdminPanel' на нужный URL

      } else {
        // Обработайте ошибку, например, выведите сообщение об ошибке на странице
        console.log("not Authenticated");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <Container className="sign">
      <Form
        style={{ maxWidth: "400px", width: "100%" }}
        className="mx-auto"
        onSubmit={handleFormSubmit}
      >
        <img
          className="mb-4 text-center mx-auto d-block"
          src={logo}
          alt="logo"
          height="64"
        />
        <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
          <Form.Label className="fs-4">Email</Form.Label>
          <Form.Control
            required
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We do not guarantee that your email address is secure.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="fs-4">Password</Form.Label>
          <Form.Control
            required
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Remember Me"
            name="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
        </Form.Group>
        <Button
          type="submit"
          className="text-center mx-auto d-block"
        >
          Sign-In
        </Button>
        <p className="mt-5 mb-3 text-center text-muted"> Music cloud © 2023</p>
      </Form>
    </Container>
  );
};

export default SignIn;
