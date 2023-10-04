import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useAuth } from "../Service/AuthContext";

function SignButton() {
    const { isAuthenticated } = useAuth(); // Получите isAuthenticated и logout из контекста

    
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
  
  export default SignButton;
  