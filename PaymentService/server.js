const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5005;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'payments_service',
  password: '112211',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Aktualizacja statusu płatności
app.post("/payment_status", async (req, res) => {
  const { user_id } = req.body;

  console.log("Received POST /payment_stats with user_id:", user_id);

  if (!user_id) {
    console.log("Missing payment_id in request body");
    return res.status(400).json({ error: "Missing payment_id" });
  }

  const errors = [];
  const successfulInserts = [];

  try {
    console.log("Attempting to update payment status in the database");
    const newItem = await pool.query(
      "UPDATE payments SET status = true WHERE user_id = $1 RETURNING *", [user_id] //TUTAJ NA PODSTAWIE PRZEKAZANEGO USER ID Z PAYMENTDIALOG.JS USTAWIA WSZYSTKIE Z TYM ID NA TRUE, MOZNA COS POMYSLEC TEZ
    );
    if (newItem.rows.length > 0) {
      console.log("Payment status updated successfully:", newItem.rows[0]);
      successfulInserts.push(newItem.rows[0]);
    } else {
      console.log("Failed to update payment status for payment_id:", user_id);
      errors.push({ user_id, error: "Update failed" });
    }
  } catch (err) {
    console.error("Error updating payment status:", err.message);
    errors.push({ payment_id, error: "Server Error" });
  }

  if (errors.length > 0) {
    console.log("Errors encountered:", errors);
    return res.status(400).json({ errors, successfulInserts });
  }

  console.log("POST /payment_stats response:", successfulInserts);
  res.json({ successfulInserts });
});





app.post("/insert_payment", async (req, res) => {
    const temp = req.body;
    console.log("SERVER", temp);
  
    const errors = [];
    const successfulInserts = [];
  
      const {user_id, restaurant_name, payment_id } = req.body;
      console.log(user_id, restaurant_name, payment_id);

      try {
        const newItem = await pool.query(
          "INSERT INTO payments (user_id, restaurant_name, payment_id) VALUES ($1, $2, $3) RETURNING *",
          [user_id, restaurant_name, payment_id]
        );
        successfulInserts.push(newItem.rows[0]);
      } catch (err) {
        console.error(err.message);
        errors.push({ element, error: "Server Error" });
      }
  
    if (errors.length > 0) {
      return res.status(400).json({ errors, successfulInserts });
    }
  
    res.json({ successfulInserts });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
