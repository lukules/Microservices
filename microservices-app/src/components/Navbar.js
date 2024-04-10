import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import logo from '../images/logo.png';

const Navbar = () => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/cities') 
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleChangeCity = (event) => {
    setSelectedCity(event.target.value);
  };



  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
          <Typography variant="h5" noWrap sx={{ marginLeft: 1 }}>
            UberEatz
          </Typography>
          
          <FormControl sx={{ m: 1, minWidth: 240, ml:16 }} size="small">
            <InputLabel id="city-select-label">City</InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select"
              value={selectedCity}
              label="City"
              onChange={handleChangeCity}
            >
              {cities.map((city, index) => (
                <MenuItem key={index} value={city.city}>{city.city}</MenuItem>
              ))}

            </Select>
          </FormControl>
          
       
        </Box>
        
        <TextField
          variant="outlined"
          placeholder="Search in UberEatz..."
          size="small"
          sx={{ '.MuiOutlinedInput-root': { borderRadius: '30px' }, input: { padding: '10px 14px' }, width: 600 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { mr: 2 } }}>
          <Button color="primary" sx={{ fontSize: '1.1rem' , fontWeight: 500 }} >Login</Button>
          <Button color="secondary" sx={{ fontSize: '1.1rem', fontWeight: 500 }} >Register</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
