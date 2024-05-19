const jwt = require('jsonwebtoken');

const refreshToken = (req, res) => {
  const { token } = req.body;
  jwt.verify(token, 'jwtSecret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const newToken = jwt.sign({ id: decoded.id }, 'jwtSecret', { expiresIn: '8h' });
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 8 * 3600000
    });
    res.json({ token: newToken });
  });
};

module.exports = refreshToken;
