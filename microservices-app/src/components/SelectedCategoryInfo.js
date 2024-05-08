import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const SelectedCategoryInfo = ({ selectedCategory, selectedCity }) => {
  const [restaurants, setRestaurants] = useState([]);

  const formatName = (name) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };
  

  useEffect(() => {
    if (selectedCategory && selectedCity) {
      fetch(`http://localhost:5000/categoryrestaurants?city=${selectedCity}&category=${selectedCategory}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched restaurants data:', data);
          const formattedData = data.map(restaurant => ({
            ...restaurant,
            name: formatName(restaurant.name),
          }));
          setRestaurants(formattedData);
        })
        .catch(error => {
          console.error('Error fetching restaurants:', error);
          setRestaurants([]);
        });
    }
  }, [selectedCategory, selectedCity]);
  

  return (
    <div>
      <Typography variant="h6" gutterBottom>Wybrana kategoria: {selectedCategory}</Typography>
      <Typography variant="h6" gutterBottom>Restauracje:</Typography>
      <List>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${restaurant.name}:\n${restaurant.description}`}
                primaryTypographyProps={{ component: 'div', style: { whiteSpace: 'pre-wrap' } }}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No restaurants found" />
          </ListItem>
        )}
      </List>
    </div>
  );
}

export default SelectedCategoryInfo;
