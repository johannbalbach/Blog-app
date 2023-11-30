const express = require('express');
const path = require('path');

const app = express();
const port = 5500;

// Разрешить статические файлы из папки view
app.use(express.static(path.join(__dirname, 'view')));
//app.use('/login', express.static(path.join(__dirname, 'view')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

// app.get('/scripts/loginFetch.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'scripts', 'loginFetch.js'));
// });


app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'profile.html'));
});

// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, 'view', 'login.html'));
// });

// app.get('/registration', (req, res) => {
//     res.sendFile(path.join(__dirname, 'view', 'registration.html'));
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});