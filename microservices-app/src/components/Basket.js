// Basket.js
import React, { useState } from 'react';
import { Menu, MenuItem, Typography, Box, Button, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import PaymentDialog from './PaymentDialog'; 

const Basket = ({ anchorEl, onClose, basketItems = [], removeFromBasket, clearBasket, formattedName }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [basketId, setBasketId] = useState(null);

  const totalCost = basketItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);

  const handleCheckout = async (event) => {
    if (event) {
      event.preventDefault();
    }
    const userId = user ? user.id : 0;
    const dataToSend = basketItems.map(item => ({
      item_name: item.item_name,
      user_id: userId,
      item_price: parseFloat(item.price).toFixed(2),
      restaurant_name: formattedName
    }));

    console.log("Data being sent to basket endpoint:", dataToSend);

    try {
      const response = await fetch('http://localhost:5003/basket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log("Response from basket endpoint:", data);

      if (data.successfulInserts && data.successfulInserts.length > 0) {
        const newBasketId = data.successfulInserts[0].basket_id; // Assuming the basket ID is returned in the first successful insert
        setBasketId(newBasketId);

        // Send data to payment server (include basketId)
        const dataToSend2 = {
          payment_id: newBasketId
        };

        console.log("Data being sent to payment endpoint:", dataToSend2);

        try {
          const response2 = await fetch('http://localhost:5005/payment_status', { // Updated endpoint to payment_status
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend2),
          });

          if (!response2.ok) {
            const errorText = await response2.text();
            throw new Error(errorText);
          }

          const data2 = await response2.json();
          console.log("Response from payment endpoint:", data2);
        } catch (error) {
          console.error('Error:', error);
        }

        toast.success('Send to db successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: "🚀"
        });
      } else {
        // Handle case where successfulInserts is empty
        console.error('No successful inserts found in response');
        toast.error('An error occurred while placing the order.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to send data: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };




  const handleAnotherAction = async (event) => {

    setPaymentStatus(true);   //TUTAJ ZAWSZE NA TRUE USTAWIA NAPIS ZE ZAAKCEPTOWANO PLATNOSC MOZNA SIE POBAWIC
    setOpen(true);
  };

  const handleClick = async (event) => {
    await handleCheckout(event);
    handleAnotherAction();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
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
          <Button onClick={handleClick} startIcon={<ShoppingCartIcon />} sx={{ color: 'green' }}>
            Payment
          </Button>
        </Box>
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          <Button onClick={clearBasket} startIcon={<DeleteIcon />} sx={{ color: 'red' }}>
            Delete all items
          </Button>
        </Box>
      </Menu>
      <PaymentDialog open={open} onClose={handleClose} paymentStatus={paymentStatus} />
    </>
  );
};

export default Basket;
