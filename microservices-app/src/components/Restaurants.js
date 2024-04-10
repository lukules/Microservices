import React, { useEffect, useState } from 'react';
import { Grid, Paper, CardMedia, Box, Typography } from '@mui/material';
import burgerImage from '../images/burger.jpg';


const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/restaurants')
      .then(response => response.json())
      .then(data => {
        setRestaurants(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <Grid container spacing={3}>
      {restaurants.map((restaurant) => (
        <Grid item xs={12} sm={6} md={4} key={restaurant.restaurant_id}>
          <Paper elevation={1} sx={{ position: 'relative', p: 2 }}>
            <CardMedia
              component="img"
              height="200"
              image={burgerImage}
              alt={restaurant.name}
            />
            <Box sx={{
              position: 'absolute',
              bottom: '8px',
              left: '16px',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              px: 2,
              py: '2px',
              borderRadius: '4px',
            }}>
              <Typography variant="caption">{restaurant.description}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Restaurants;
