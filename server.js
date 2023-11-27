const express = require('express');
const path = require('path');

const app = express();
const port = 5500;

// Разрешить статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

//add route


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
