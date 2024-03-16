const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 3000;

// Połączenie z bazą danych SQLite
const db = new sqlite3.Database("example.db");

// Dodajemy rekord użytkownika do bazy danych SQLite
// const insertUserQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
// const userData = ['john_doe', 'john@example.com', 'password123'];

// db.run(insertUserQuery, userData, function(err) {
//   if (err) {
//     return console.error('Error inserting user:', err.message);
//   }
//   console.log(`User inserted with ID: ${this.lastID}`);
// });

// Utworzenie tabeli users, jeśli nie istnieje
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT
)`);

// Middleware do parsowania ciała żądania w formacie JSON
app.use(bodyParser.json());

// Serwowanie plików statycznych z katalogu public
app.use(express.static(path.join(__dirname, "public")));


// Demo SQL Injection
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Zapytanie SQL podatne na SQL injection
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // Wykonaj zapytanie do bazy danych
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (rows.length > 0) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// DEMO CSRF
app.post("/change-password", (req, res) => {
  const newPassword = req.body.newPassword;
  console.log("New password:", newPassword);
//   res.send("Password changed successfully to: " + newPassword);
res.json({ message: "Password changed successfully to: " + newPassword });
});

// Serwer nasłuchuje na określonym porcie
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
