import React, { useEffect, useState } from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import burgerImage from '../images/burger.jpg';
import deseryImage from '../images/desery.jpg';
import kawaImage from '../images/kawa.jpg';
import indyjskaImage from '../images/indyjska.jpg';
import kanapkiImage from '../images/kanapki.jpg';
import lodyImage from '../images/lody.jpg';
import amerykanskaImage from '../images/amerykanska.jpg';
import pizzaImage from '../images/pizza.jpg';
import sushiImage from '../images/sushi.jpg';
import weganskieImage from '../images/weganskie.jpg';
import wloskaImage from '../images/wloska.jpg';
import zupaImage from '../images/zupa.jpg';

const defaultImage = '/path-to-default-image.png'; // Upewnij się, że ścieżka jest poprawna

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/categories')
      .then(response => response.json())
      .then(data => {
        const categoriesData = data.map((category, index) => ({
          id: index,
          title: category.name,
          imageUrl: defaultImage, // Możesz tutaj ustawić domyślny obraz
          count: category.count, 
        }));
        setCategories(categoriesData);
      })
      .catch(error => console.error('Error:', error));
  }, []);


  const images = {
    Burgery: burgerImage,
    Desery: deseryImage,
    Kawa: kawaImage,
    Indyjska: indyjskaImage,
    Kanapki: kanapkiImage,
    Lody: lodyImage,
    Amerykanska: amerykanskaImage,
    Pizza: pizzaImage,
    Sushi: sushiImage,
    Weganskie: weganskieImage,
    Wloska: wloskaImage,
    Zupa: zupaImage,
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={2.4} key={category.title}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                height="200"
                width="300"
                image={images[category.title] || defaultImage}
                alt={category.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {category.title}
                </Typography>
                <Typography color="text.secondary" sx= {{fontSize: 20}}>
                  Miejsca: {category.count}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Categories;