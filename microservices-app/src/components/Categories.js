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

const defaultImage = '/path-to-default-image.png'; 

const Categories = ({ selectedCity, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5000/categories?city=${selectedCity}`)
        .then(response => response.json())
        .then(data => {
          const categoriesData = data.map((category, index) => ({
            id: index,
            title: category.name,
            imageUrl: defaultImage, 
            count: category.count, 
          }));
          setCategories(categoriesData);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [selectedCity]);

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); 
    console.log('Selected category:', category); 
    onSelectCategory(category);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={2.4} key={category.title}>
          <Card onClick={() => handleCategoryClick(category.title)}> 
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
                  Places: {category.count}
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
