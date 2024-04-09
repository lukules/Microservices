import React from 'react';
import {
 Typography, Container
} from '@mui/material';
import Navbar from './Navbar';
import Categories from './Categories'; // Zaimportuj komponent Categories
import Restaurants from './Restaurants'; // Zaimportuj komponent Restaurants
import burgerImage from '../images/burger1.jpg';
import sushiImage from '../images/sushi1.jpg';

const Main = () => {
  const categories = [
    { id: 1, title: 'Kuchnia amerykańska', count: 241, imageUrl: sushiImage },
    { id: 2, title: 'Burger', count: 208, imageUrl: burgerImage },
    // ... inne kategorie
  ];

  const restaurants = [
    { id: 1, name: 'Restauracja Sushi', offer: '-30% na całe menu', imageUrl: sushiImage },
    { id: 2, name: 'Restauracja Burgery', offer: '-20%', imageUrl: burgerImage },
    // ... inne restauracje
  ];

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" align="left" sx={{ my: 4, ml: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Restaurants - Warsaw
        </Typography>
        
        {/* Sekcja kategorii */}
        <Typography variant="h6" gutterBottom>Categories</Typography>
        <Categories categories={categories} /> {/* Użycie komponentu Categories */}
        
        {/* Sekcja restauracji */}
        <Typography variant="h6" gutterBottom>All restaurants</Typography>
        <Restaurants restaurants={restaurants} /> {/* Użycie komponentu Restaurants */}
      </Container>
    </>
  );
}

export default Main;
