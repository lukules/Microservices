import React from 'react';
import { Grid, Paper, CardMedia, Box, Typography } from '@mui/material';

const Restaurants = ({ restaurants }) => (
  <Grid container spacing={3}>
    {restaurants.map((restaurant) => (
      <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
        <Paper elevation={1} sx={{ position: 'relative', p: 2 }}>
          <CardMedia
            component="img"
            height="200"
            image={restaurant.imageUrl}
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
            <Typography variant="caption">{restaurant.offer}</Typography>
          </Box>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default Restaurants;
