const express = require('express');
const router = express.Router();
const pool = require('../../database')

router.get('/', async function(req, res){
    const [results] = await pool.query(`SELECT * FROM cuisines`);
    res.json(results);
})

module.exports = router;