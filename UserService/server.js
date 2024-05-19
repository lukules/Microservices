const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const registerUser = require('./commands/registerUser');
const loginUser = require('./commands/loginUser');
const refreshToken = require('./commands/refreshToken');
const verifyToken = require('./queries/verifyToken');

const PORT = 5002;

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.post('/register', registerUser);
app.post('/login', loginUser);
app.post('/refreshToken', refreshToken);
app.post('/verifyToken', verifyToken);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
