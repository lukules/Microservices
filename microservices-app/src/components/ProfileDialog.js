import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, Box, Typography, IconButton, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../context/AuthContext';

const ProfileDialog = ({ open, onClose }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postalCode: '',
    street: '',
    city: ''
  });

  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    postalCode: false,
    street: false,
    city: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phone: user.phone,
        postalCode: user.postalcode || '',
        street: user.street || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = (field) => {
    setEditMode({
      ...editMode,
      [field]: !editMode[field]
    });
  };

  const handleSubmit = () => {
    updateUser(formData).then(() => {
      onClose();
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm" 
      sx={{ marginTop: 12 }}
      BackdropProps={{
        style: { backgroundColor: 'transparent' }
      }}
    >
      <DialogTitle>
        <Box textAlign="center">
          <Typography variant="h4">Edit Profile</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {['firstName', 'lastName', 'email', 'phone', 'postalCode', 'street', 'city'].map((field) => (
            <Grid item xs={12} key={field}>
              <Box display="flex" alignItems="center">
                <TextField
                  margin="dense"
                  id={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  type="text"
                  fullWidth
                  variant="standard"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: !editMode[field]
                  }}
                />
                <IconButton onClick={() => handleEdit(field)} edge="end">
                  <EditIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ marginTop: 4 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
