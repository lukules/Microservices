import React, { useState } from 'react';
import { Menu, MenuItem, ListItemText, Typography, Divider, Box, Button, List, ListItem, ListItemIcon, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

const Basket = ({ anchorEl, onClose }) => {
  const [basketItems, setBasketItems] = useState([
    { id: 1, name: 'Pizza Margherita', price: '30.00 zł' },
    { id: 2, name: 'Pasta Carbonara', price: '25.00 zł' },
    { id: 3, name: 'Tiramisu', price: '15.00 zł' },
    { id: 4, name: 'Coca Cola', price: '5.00 zł' },
  ]);

  const handleRemoveItem = (id) => {
    setBasketItems(basketItems.filter(item => item.id !== id));
  };

  const handleClearBasket = () => {
    setBasketItems([]);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300,
          maxHeight: 400,
          overflowY: 'auto',
          '& .MuiMenuItem-root': {
            justifyContent: 'space-between',
          },
        },
      }}
    >
      {basketItems.length > 0 ? (
        <List>
          {basketItems.map((item) => (
            <ListItem key={item.id} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)}>
                <ClearIcon />
              </IconButton>
            }>
              <ListItemIcon>
                <ShoppingCartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.name} secondary={item.price} />
            </ListItem>
          ))}
        </List>
      ) : (
        <MenuItem>
          <Typography variant="body1">Basket is empty</Typography>
        </MenuItem>
      )}
      <Divider />
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
        <Button onClick={handleClearBasket} startIcon={<DeleteIcon />} sx={{ color: 'red' }}>
          Delete all items
        </Button>
      </Box>
    </Menu>
  );
};

export default Basket;
