const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid'); 

const PORT = 5003;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "basket_service",
  password: "112211",
  port: 5432,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/basket", async (req, res) => {
  const temp = req.body;
  console.log("This is temp:", temp);

  const errors = [];
  const successfulInserts = [];

  const basketId = uuidv4();

  for (const element of temp) {
    const { item_name, user_id, item_price, restaurant_name } = element;

    if (!item_name || !user_id || !item_price || !restaurant_name) {
      errors.push({ element, error: "All fields are required" });
      continue;
    }

    try {
      const newItem = await pool.query(
        "INSERT INTO basket (basket_id, item_name, user_id, item_price, restaurant_name) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [basketId, item_name, user_id, parseFloat(item_price), restaurant_name] // Use the same basketId
      );
      successfulInserts.push(newItem.rows[0]);
    } catch (err) {
      console.error(err.message);
      errors.push({ element, error: "Server Error" });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, successfulInserts });
  }

  res.json({ successfulInserts });

  const dataToSend2 = {
    user_id: temp[0].user_id, 
    restaurant_name: temp[0].restaurant_name,
    payment_id: basketId,
  };

  console.log(dataToSend2);

  try {
    const response = await fetch('http://localhost:5005/insert_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend2),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
  } catch (error) {
    console.error('Error:', error);
    // Handle error from payment server if needed
  }
});


app.get('/get_orders_for_courier', async (req, res) => {
  try {
      // 1. Fetch all orders from your database
      const result = await pool.query(`
          SELECT basket_id, restaurant_name, user_id
          FROM basket
          GROUP BY basket_id, restaurant_name, user_id
      `);

      const orders = result.rows;

      // 2. For each order, get the items and calculate the total price
      for (let order of orders) {
          const itemsResult = await pool.query(`
              SELECT item_name, item_price
              FROM basket
              WHERE basket_id = $1
          `, [order.basket_id]);
          order.items = itemsResult.rows.map(item => item.item_name);
          order.total_price = 0; 
          
          for(let item of itemsResult.rows){
              order.total_price += parseFloat(item.item_price)
          }
      }

      res.json(orders); 
  } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/get_restaurant_info_for_order', async (req, res) => {
  const basketId = req.query.basketId;

  try {
      // 1. Get the restaurant_id from the basket_service database
      const basketResult = await pool.query(
          'SELECT restaurant_name FROM basket WHERE basket_id = $1 LIMIT 1', 
          [basketId]
      );

      if (basketResult.rows.length === 0) {
          return res.status(404).json({ error: 'Basket not found' });
      }

      const restaurantName = basketResult.rows[0].restaurant_name;

      // 2. Fetch the restaurant details from the microservices database
      // Now using the restaurant name from basket_service
      const restaurantPool = new Pool({ 
          user: 'postgres',
          host: 'localhost',
          database: 'microservices', // Your microservices database
          password: '112211',
          port: 5432,
      });

      const restaurantResult = await restaurantPool.query(
          'SELECT name, address, city FROM restaurants WHERE name = $1',
          [restaurantName]
      );

      if (restaurantResult.rows.length > 0) {
          res.json(restaurantResult.rows[0]);
      } else {
          res.status(404).json({ error: 'Restaurant not found in microservices database' }); 
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});


// Wyczyść koszyk użytkownika
app.delete('/basket/user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    await pool.query('DELETE FROM basket WHERE user_id = $1', [user_id]);
    res.json({ message: 'All items removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
