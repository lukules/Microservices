import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Box, InputAdornment } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:5002/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          login(username, data.token);
          setOpen(false);
        } else {
          throw new Error('Login failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Login failed: ' + error.message);
      });
  };

  return (
    <div>
      <Button color="primary" onClick={handleOpen}>Login</Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Box textAlign="center">
            <AccountCircle style={{ fontSize: 120, color: '#fca311' }} />
            <Typography sx={{ color: '#fca311', fontSize: '6vh' }}>Login</Typography>
          </Box>
        </DialogTitle>
        <DialogContent style={{ padding: '50px' }}>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ color: '#fca311' }} />
                </InputAdornment>
              ),
              sx: { fontSize: '2rem' }
            }}
            InputLabelProps={{
              style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
              shrink: true
            }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: '#fca311' }} />
                </InputAdornment>
              ),
              sx: { fontSize: '2rem' }
            }}
            InputLabelProps={{
              style: { color: '#fca311', fontSize: '2rem', top: '-13px' },
              shrink: true
            }}
          />
        </DialogContent>
        <DialogActions style={{ padding: '20px', marginBottom: '20px', justifyContent: 'center' }}>
          <Button sx={{ fontSize: '1.25rem', minWidth: '150px' }} onClick={handleClose}>Cancel</Button>
          <Button sx={{ fontSize: '1.25rem', minWidth: '150px' }} variant="contained" color="secondary" onClick={handleSubmit}>Login</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoginForm;
