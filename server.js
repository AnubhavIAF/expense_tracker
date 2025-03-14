const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require("./routes/purchaseRoutes");
const path = require('path'); // Import the 'path' module
require('dotenv').config();  // ✅ Load environment variables
const helmet = require('helmet');
const compression= require('compression');
const https=require('https');
const fs=require('fs');

const app = express();

const privateKey=fs.readFileSync('server.key');
const certificte=fs.readFileSync('server.cert');
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ Use sessions for authentication
app.use(session({
    secret: process.env.SESSION_SECRET,  // Access from .env,
    resave: false,
    saveUninitialized: true
}));

// ✅ Routes
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes); // ✅ Move this above static files

// ✅ Serve static files (Frontend)
app.use(express.static('public'));

// ✅ Add this route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Add this route to serve resetPassword.html
app.get('/password/resetpassword/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resetPassword.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https.createServer({key: privateKey, cert: certificte},app).listen(5000, () => console.log("Server is running at http://localhost:5000"));