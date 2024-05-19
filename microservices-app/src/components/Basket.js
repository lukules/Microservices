import React from 'react';
import { Menu, MenuItem, ListItemText, Typography, Divider, Box, Button, List, ListItem, ListItemIcon, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

const Basket = ({ anchorEl, onClose, basketItems = [], removeFromBasket, clearBasket }) => {
  const totalCost = basketItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);

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
        <>
          <List>
            {basketItems.map((item, index) => (
              <ListItem key={index} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => removeFromBasket(index)}>
                  <ClearIcon />
                </IconButton>
              }>
                <ListItemIcon>
                  <ShoppingCartIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.item_name} secondary={`${item.price} zł`} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Total:</Typography>
            <Typography variant="body1">{totalCost} zł</Typography>
          </Box>
          <Divider />
        </>
      ) : (
        <MenuItem>
          <Typography variant="body1">Basket is empty</Typography>
        </MenuItem>
      )}
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
        <Button onClick={clearBasket} startIcon={<DeleteIcon />} sx={{ color: 'red' }}>
          Delete all items
        </Button>
      </Box>
    </Menu>
  );
};

export default Basket;
