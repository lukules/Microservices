const express = require('express');
const { Pool } = require('pg'); 
const cors = require('cors');
const app = express();
const PORT = 5000;

// Konfiguracja połączenia z bazą danych
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'microservices',
  password: '112211',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// endpoint for cities
app.get('/cities', async (req, res) => {
  try {
    const queryResult = await pool.query('SELECT city FROM restaurants GROUP BY city');
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




app.get('/categories', async (req, res) => {
  try {
    const queryResult = await pool.query('SELECT categories FROM restaurants');
    let categoryCounts = {};
    
    queryResult.rows.forEach(row => {
      const categoriesArray = row.categories.split(' ').filter(category => category.trim() !== '');
      categoriesArray.forEach(category => {
        if (!categoryCounts[category]) {
          categoryCounts[category] = 1;
        } else {
          categoryCounts[category]++;
        }
      });
    });
    
    const categoriesList = Object.keys(categoryCounts).map(category => ({
      name: category,
      count: categoryCounts[category]
    })).filter(category => category.name !== '');

    res.json(categoriesList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



app.get('/restaurants', async (req, res) => {
  try {
    const queryResult = await pool.query('SELECT restaurant_id, name, categories, description, address, city, phone_number FROM restaurants');
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});






app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
