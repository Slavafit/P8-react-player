import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';


export default function SignButton({ auth }) {
    
    return (
      <>
        {!auth ? (
          <Link to="/signin" style={{ textDecoration: 'none' }}>
            <Button variant="contained">Sign In</Button>
          </Link>
        ) : null}
      </>
    );
  }
  