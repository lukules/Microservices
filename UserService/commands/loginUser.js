const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const loginUser = async (req, res) => {
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
      maxAge: 8 * 3600000
    });
    res.json({ token });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = loginUser;
