const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Add this line
const path = require('path'); // Add this line
const app = express();
const port = 8081;

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "disaster_data"
});
app.use(cors()); // Add this line
db.connect(err => {
    if (err) throw err;
    console.log("Connected to database.");
});

// Serve static files (e.g., HTML, CSS, JS) from the root directory
app.use(express.static(__dirname));

// Route to fetch disaster updates based on location
app.get('/disasters', (req, res) => {
    const location = req.query.location || '';
    const sql = `SELECT * FROM disasters WHERE location LIKE ?`;
    db.query(sql, [`%${location}%`], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route to serve disasters.html
app.get('/disasters.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'disasters.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
