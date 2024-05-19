const bcrypt = require('bcrypt');
const pool = require('../db');

const registerUser = async (req, res) => {
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
};

module.exports = registerUser;
