import React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

const Categories = ({ categories }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    {categories.map((category) => (
      <Grid item xs={12} sm={6} md={2.4} key={category.id}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={category.imageUrl}
              alt={category.title}
            />
            <CardContent>
              <Typography gutterBottom variant="subtitle1" component="div">
                {category.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Miejsca: {category.count}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default Categories;
