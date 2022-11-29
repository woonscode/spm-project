import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';

import { useLocation, useNavigate } from "react-router-dom"
import axios from 'axios';
import {useState, useEffect } from 'react';
import { getFormLabelUtilityClasses } from '@mui/material';

export default function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [staffId, setStaffId] = useState("");

  const [login, setLogin] = useState(false);

  const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/'
  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && email.length > 0) {
        getRole();
    }
  }


  const tile = {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
    paddingBottom: '50px',
    borderRadius: '20px'
  };

  // const { state } = useLocation();

  const getRole = async () => {
      try {
          const response = await axios.post( `${url}login`,
            {
              email : email
            }
          );
          setEmail(email)
          setRole(response.data.staff.Role)
          setName(response.data.staff.Staff_FName)
          setLogin(true)

        localStorage.setItem("staffId", JSON.stringify(response.data.staff.Staff_ID));
        localStorage.setItem("role", JSON.stringify(response.data.staff.Role));
        localStorage.setItem("name", JSON.stringify(response.data.staff.Staff_FName));
        localStorage.setItem("login", "true");

          navigate(`/LearningJourney`, {
          state: {
            role: response.data.staff.Role,
            staffId: response.data.staff.Staff_ID,
            name: response.data.staff.Staff_FName,
            login: true
          }
          })

        }catch(e){
            alert("Axios Error")
        }
  }

  return (
    <div style={tile}>
      <Container>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="email"
              label="Email Address"
              name="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              label="Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  </div>
  );
}