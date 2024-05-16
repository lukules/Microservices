const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = 5002;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'user_service',
  password: '112211',
  port: 5432,
});

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Adres Twojej aplikacji React
  credentials: true // Wymagane, aby cookies były obsługiwane przez CORS
}));
app.use(express.json());
app.use(cookieParser());

app.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, dob, email, phone } = req.body;
  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2 OR username = $3', [email, phone, username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email, phone number, or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, password, firstname, lastname, dob, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
      [username, hashedPassword, firstName, lastName, dob, email, phone]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    const token = jwt.sign({ id: user.rows[0].id }, 'jwtSecret', { expiresIn: '8h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 8 * 3600000 // 8 godzin
    });
    res.json({ token });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/verifyToken', (req, res) => {
  const { token } = req.body;
  jwt.verify(token, 'jwtSecret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false });
    }
    const userId = decoded.id;
    pool.query('SELECT * FROM users WHERE id = $1', [userId])
      .then(result => {
        if (result.rows.length > 0) {
          const user = result.rows[0];
          res.json({ valid: true, user });
        } else {
          res.status(404).json({ valid: false });
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        res.status(500).json({ valid: false });
      });
  });
});

app.post('/refreshToken', (req, res) => {
  const { token } = req.body;
  jwt.verify(token, 'jwtSecret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const newToken = jwt.sign({ id: decoded.id }, 'jwtSecret', { expiresIn: '8h' });
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 8 * 3600000 // 8 godzin
    });
    res.json({ token: newToken });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
