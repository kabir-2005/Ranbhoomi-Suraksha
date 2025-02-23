const mysql = require('mysql');
const fs = require('fs');
const csv = require('csv-parser');

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'disaster_data'
});

// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
    importCSVData();
});

// Function to import CSV data into MySQL
function importCSVData() {
    const results = [];
    fs.createReadStream('D:/SMART INDIA HACKATHON FRONT END/disaster_news.csv')
        .pipe(csv(['Timestamp', 'location', 'disaster_type', 'headline'])) // Adjust column names if necessary
        .on('data', (data) => results.push(data))
        .on('end', () => {
            insertData(results);
        });
}

// Function to insert data into the MySQL database
function insertData(data) {
    const query = 'INSERT INTO disasters (timestamp, location, disaster_type, headline) VALUES ?';
    const values = data.map(row => [row.timestamp, row.location, row.disaster_type, row.headline]);

    db.query(query, [values], (err, result) => {
        if (err) throw err;
        console.log('Data inserted');
        db.end(); // Close the database connection
    });
}
