import React from 'react';
import { Typography, Container } from '@mui/material';
import Navbar from './Navbar';
import Categories from './Categories'; // Importujesz komponent Categories
import Restaurants from './Restaurants'; // Importujesz komponent Restaurants

const Main = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" align="left" sx={{ my: 4, ml: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Restauracje - Warszawa
        </Typography>
        
        {/* Sekcja kategorii */}
        <Typography variant="h6" gutterBottom>Kategorie</Typography>
        <Categories /> {/* Komponent Categories bez propsów */}
        
        {/* Sekcja restauracji */}
        <Typography variant="h6" gutterBottom>Wszystkie restauracje</Typography>
        <Restaurants />
       
      </Container>
    </>
  );
}

export default Main;
