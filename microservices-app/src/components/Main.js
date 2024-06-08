import React, { useState } from 'react';
import { Typography, Container } from '@mui/material';
import Navbar from './Navbar';
import Categories from './Categories';
import Restaurants from './Restaurants';
import SelectedCategoryInfo from './SelectedCategoryInfo';

const Main = ({ onBasketClick, basketItems, onOverlayToggle }) => { // Accept onOverlayToggle prop
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSelectedCategory(null);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Navbar
        onSelectCity={handleSelectCity}
        onBasketClick={onBasketClick}
        basketItems={basketItems}
        showCitySelect={true}
        onOverlayToggle={onOverlayToggle} // Pass onOverlayToggle to Navbar
      />
      <Container maxWidth="lg" align="left" sx={{ my: 4, ml: 4, mt: 12 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Restauracje - {selectedCity ? selectedCity : 'Wybierz miasto'}
        </Typography>

        {selectedCategory === null && (
          <>
            <Typography variant="h6" gutterBottom>Kategorie</Typography>
            <Categories
              selectedCity={selectedCity}
              onSelectCategory={handleSelectCategory} 
            />

            <Typography variant="h6" gutterBottom>Wszystkie restauracje</Typography>
            <Restaurants selectedCity={selectedCity} />
          </>
        )}

        {selectedCategory !== null && (
          <SelectedCategoryInfo selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          />
        )}
      </Container>
    </>
  );
}

export default Main;
