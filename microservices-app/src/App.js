import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Main from './components/Main';
import RestaurantMenu from './components/RestaurantMenu';
import Basket from './components/Basket';

function App() {
  const [basketItems, setBasketItems] = useState([]);
  const [basketAnchorEl, setBasketAnchorEl] = useState(null);

  const addToBasket = (item) => {
    setBasketItems([...basketItems, item]);
  };

  const removeFromBasket = (index) => {
    const newBasketItems = basketItems.filter((_, i) => i !== index);
    setBasketItems(newBasketItems);
  };

  const clearBasket = () => {
    setBasketItems([]);
  };

  const handleBasketClick = (event) => {
    if (basketAnchorEl) {
      setBasketAnchorEl(null);
    } else {
      setBasketAnchorEl(event.currentTarget);
    }
  };

  const handleBasketClose = () => {
    setBasketAnchorEl(null);
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Main onBasketClick={handleBasketClick} basketItems={basketItems} />} />
              <Route path="/:name" element={<RestaurantMenu addToBasket={addToBasket} onBasketClick={handleBasketClick} basketItems={basketItems} />} />
            </Routes>
            <Basket 
              anchorEl={basketAnchorEl}
              onClose={handleBasketClose}
              basketItems={basketItems}
              removeFromBasket={removeFromBasket}
              clearBasket={clearBasket}
            />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
