const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); 
const PORT = 5002;
const cors = require('cors');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'user_service',
    password: '112211',
    port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    console.log(req.body);
    try {
      const { username, password, firstName, lastName, dob, email, phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query('INSERT INTO users (username, password, firstname, lastname, dob, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [username, hashedPassword, firstName, lastName, dob, email, phone]);
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});


app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }
      const token = jwt.sign({ id: user.rows[0].id }, 'jwtSecret', { expiresIn: '1h' });
      res.json({ token, message: "Login successful" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: 'Server Error' });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  