import React, { useEffect, useState } from 'react';
import { Grid, Paper, CardMedia, Box, Typography } from '@mui/material';
import placeholderImage from '../images/placeholder.jpg';

const Restaurants = ({ selectedCity }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5000/restaurants?city=${selectedCity}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setRestaurants(data);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [selectedCity]);

  const formatCurrency = (value) => {
    return value ? `${Number(value).toFixed(2)} zł` : 'Brak danych';
  };
  
  const formatTime = (value) => {
    return value ? `${Math.round(Number(value))} min` : 'Brak danych';
  };
  
  const formatDistance = (value) => {
    return value ? `${Number(value).toFixed(2)} km` : 'Brak danych';
  };
  

  return (
    <Grid container spacing={3}>
      {restaurants.map((restaurant) => (
        <Grid item xs={12} sm={6} md={4} key={restaurant.restaurant_id}>
          <Paper elevation={1}>
            <CardMedia
              component="img"
              height="200"
              image={placeholderImage}
              alt={restaurant.name}
            />
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{restaurant.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Min Order: {formatCurrency(restaurant.minimal_order_value)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estimated Delivery: {formatTime(restaurant.estimated_time_arrival)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Delivery Fee: {formatCurrency(restaurant.basic_delivery_fee)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Free Delivery Up to: {formatDistance(restaurant.max_range_no_fee)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Restaurants;
