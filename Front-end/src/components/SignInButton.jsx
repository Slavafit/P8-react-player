import React from "react";
// import Link from '@mui/material/Link';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useAuth } from "../Service/AuthContext";


export default function SignButton() {
    const { isAuthenticated } = useAuth(); // Получите isAuthenticated  из контекста
    
    return (
      <>
        {!isAuthenticated ? (
          <Link to="/SignIn" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Sign In</Button>
          </Link>
        ) : null}
      </>
    );
  }
  