import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, Container } from '@mui/material';
import Navbar from './Navbar';

const RestaurantMenu = ({ addToBasket, onBasketClick, basketItems }) => {
  const { name } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const formattedName = name.toLowerCase().replace(/ /g, '-');
    fetch(`http://localhost:5000/menu?restaurant=${formattedName}`)
      .then(response => response.json())
      .then(data => {
        const groupedItems = data.reduce((acc, item) => {
          const category = item.category || 'Other';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});
        setMenuItems(groupedItems);
      })
      .catch(error => console.error('Error:', error));
  }, [name]);

  return (
    <>
      <Navbar onBasketClick={onBasketClick} basketItems={basketItems} showCitySelect={false} />
      <Container sx={{ mt: 10, mb: 4 }}>
        <Button 
          variant="outlined" 
          sx={{ mb: 3, position: 'fixed', top: 80, right: 20 }}
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          {name.replace(/-/g, ' ')}
        </Typography>
        {Object.keys(menuItems).length > 0 ? (
          Object.keys(menuItems).map((category, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#555' }}>
                {category}
              </Typography>
              <List>
                {menuItems[category].map((item, index) => (
                  <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {item.item_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ color: '#999' }}>
                          {`${item.price} zł`}
                        </Typography>
                      }
                    />
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => addToBasket(item)}
                    >
                      Add to Basket
                    </Button>
                  </ListItem>
                ))}
              </List>
              <Divider />
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#999' }}>No items found</Typography>
        )}
      </Container>
    </>
  );
};

export default RestaurantMenu;
