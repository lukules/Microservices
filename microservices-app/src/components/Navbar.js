import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel, Autocomplete, IconButton, Menu, ListItemIcon, Hidden, Drawer, List, ListItem, ListItemText, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import logo from '../images/logo.png';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSelectCity, onBasketClick, basketItems = [], showCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [restaurantNames, setRestaurantNames] = useState([]);
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (showCitySelect) {
      fetch('http://localhost:5000/cities')
        .then(response => response.json())
        .then(data => setCities(data))
        .catch(error => console.error('Error:', error));
    }
  }, [showCitySelect]);

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
    if (onSelectCity) {
      onSelectCity(selectedValue);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 280 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ÜberEatz
      </Typography>
      {showCitySelect && (
        <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
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
      )}
      <List>
        {isAuthenticated ? (
          <>
            <ListItem button onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleClose}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => { logout(); handleClose(); }}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button>
              <LoginForm />
            </ListItem>
            <ListItem button>
              <RegisterForm />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0', zIndex: 1400 }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <a href='/'>
            <img src={logo} alt="Logo" style={{ height: '50px' }} />
          </a>
          <Typography variant="h5" noWrap sx={{ marginLeft: 1, display: { xs: 'none', sm: 'block' } }}>
            ÜberEatz
          </Typography>
          {showCitySelect && (
            <FormControl sx={{ m: 1, minWidth: 150, display: { xs: 'none', md: 'block' }, marginLeft: 5 }} size="small">
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                value={selectedCity}
                label="City"
                onChange={handleChangeCity}
                sx={{ minWidth: 120 }}
              >
                {cities.map((city, index) => (
                  <MenuItem key={index} value={city.city}>{city.city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
              sx={{ '.MuiOutlinedInput-root': { borderRadius: '30px' }, input: { padding: '10px 14px' }, width: { xs: 300, sm: 400, md: 600 } }}
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
          <Hidden mdUp>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Hidden mdDown>
            {isAuthenticated ? (
              <>
                <IconButton onClick={onBasketClick} color="inherit">
                  <Badge badgeContent={basketItems.length} color="error">
                    <ShoppingCartIcon sx={{ fontSize: 30 }} />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleMenu} color="inherit">
                  <AccountCircleIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Settings</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { logout(); handleClose(); }}>
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">Log out</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <LoginForm />
                <RegisterForm />
              </>
            )}
          </Hidden>
        </Box>
      </Toolbar>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 }
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </AppBar>
  );
};

export default Navbar;
