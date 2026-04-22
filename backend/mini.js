import express from 'express';
const app = express();

app.get('/test', (req, res) => {
    res.send('<h1>KOMMUNIKATIONEN FUNGERAR!</h1>');
});

app.listen(8080, () => {
    console.log('MINI-SERVER STARTAD PÅ PORT 8080');
});