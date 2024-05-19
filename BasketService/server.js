const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = 5003;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'basket_service',
  password: 'your_password', // Zmień na swoje hasło do bazy danych
  port: 5432,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Dodaj przedmiot do koszyka
app.post('/basket', async (req, res) => {
  const { user_id, item_name, item_price } = req.body;
  try {
    const newItem = await pool.query(
      'INSERT INTO basket (user_id, item_name, item_price) VALUES ($1, $2, $3) RETURNING *',
      [user_id, item_name, item_price]
    );
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Pobierz przedmioty z koszyka użytkownika
app.get('/basket/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const items = await pool.query('SELECT * FROM basket WHERE user_id = $1', [user_id]);
    res.json(items.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Usuń przedmiot z koszyka
app.delete('/basket/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM basket WHERE id = $1', [id]);
    res.json({ message: 'Item removed' });
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

