import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel, Autocomplete } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import logo from '../images/logo.png';
import LoginForm from './LoginForm'; 
import RegisterForm from './RegisterForm'; // Adjust the path based on your file structure

const Navbar = ({ onSelectCity }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [restaurantNames, setRestaurantNames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/cities') 
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5000/restaurants?city=${selectedCity}`) 
        .then(response => response.json())
        .then(data => {
          const names = data.map(restaurant => restaurant.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
          setRestaurantNames(names);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [selectedCity]);

  const handleChangeCity = (event) => {
    const selectedValue = event.target.value;
    setSelectedCity(selectedValue);
    onSelectCity(selectedValue);
  };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <a href= 'https://pl.wikipedia.org/wiki/Ziemniak'>
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
          </a>
          <Typography variant="h5" noWrap sx={{ marginLeft: 1 }}>
            ÜberEatz
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
        
        <Autocomplete
          freeSolo
          id="restaurant-search"
          disableClearable
          options={restaurantNames}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search restaurants"
              variant="outlined"
              size="small"
              sx={{ '.MuiOutlinedInput-root': { borderRadius: '30px' }, input: { padding: '10px 14px' }, width: 600 }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                type: 'search',
              }}
            />
          )}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { mr: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { mr: 2 } }}>
          <LoginForm />
          <RegisterForm />
        </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
