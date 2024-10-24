const bcrypt = require('bcrypt');
const pool = require('../db');

const sendBasket = async (req, res) => {
    const { basket_id, item_name, user_id, item_price, restaurant_name } = req.body;
    console.log('Received basket:', req.body); // Loguje otrzymany koszyk
    try {
        const newItem = await pool.query(
            'INSERT INTO basket_service (basket_id, item_name, user_id, item_price, restaurant_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [basket_id, item_name, user_id, item_price, restaurant_name]
        );
        console.log('Inserted item:', newItem.rows[0]); // Loguje dodany przedmiot
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error('Error:', err.message); // Loguje błąd
        res.status(500).send('Server Error');
    }
}

module.exports = sendBasket;
