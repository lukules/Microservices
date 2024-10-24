// PaymentDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PaymentDialog = ({ open, onClose, paymentStatus, setPaymentStatus }) => {
  const { isAuthenticated, user } = useAuth();

  const handleClick = async (event) => {
    if (event) {
      event.preventDefault();
    }

    console.log("PAYMENT DIALOG");
    const userId = user ? user.id : 0;
    const dataToSend2 = {
      user_id: userId,
    };

    try {

        const dataToSend = {
          user_id: userId,
        };

        console.log("DIALOG TO SEND", dataToSend);

        const postResponse = await fetch('http://localhost:5005/payment_status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (!postResponse.ok) {
          const errorText = await postResponse.text();
          throw new Error(errorText);
        }

        const postData = await postResponse.json();
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
    onClose(); //DODAC CZYSZCZENIE KOSZYKA PO TYM MOZNA
    
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Przetwarzanie Płatności</DialogTitle>
      <DialogContent>
        <Typography>
          {paymentStatus ? 'Potwierdzono' : 'Odrzucono'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClick} color="primary">
          Okay
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
