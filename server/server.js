const express = require('express');
const { Pool } = require('pg'); 
const cors = require('cors');
const app = express();
const PORT = 5000;


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'microservices',
  password: '112211',
  port: 5432,
});

app.use(cors());
app.use(express.json());


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
    const { city } = req.query;
    let query = 'SELECT categories FROM restaurants';
    if (city) {
      query += ` WHERE city = $1`;
    }
    const queryResult = await pool.query(query, [city]);

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
    const { city } = req.query;
    let query = 'SELECT restaurant_id, name, categories, description, minimal_order_value, estimated_time_arrival, max_range_no_fee, basic_delivery_fee, address, city, phone_number FROM restaurants';
    if (city) {
      query += ` WHERE city = $1`;
    }
    const queryResult = await pool.query(query, [city]);

    const formatName = (name) => {
      return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formattedResult = queryResult.rows.map(row => ({
      ...row,
      name: formatName(row.name),
    }));

    res.json(formattedResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



app.get('/categoryrestaurants', async (req, res) => {
  try {
    const { city, category } = req.query;
    let query = 'SELECT DISTINCT name, categories, description, address, city FROM restaurants WHERE city = $1 AND categories ILIKE $2 AND city <> \'\' AND categories <> \'\'';

    const queryParams = [city, `%${category}%`];

    const queryResult = await pool.query(query, queryParams);
    res.json(queryResult.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
