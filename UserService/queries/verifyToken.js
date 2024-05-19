const jwt = require('jsonwebtoken');
const pool = require('../db');

const verifyToken = (req, res) => {
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
};

module.exports = verifyToken;
