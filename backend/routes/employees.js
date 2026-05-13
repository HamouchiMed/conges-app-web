const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, role FROM employees WHERE role = 'employee' ORDER BY name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get employees error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
