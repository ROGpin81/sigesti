const express = require('express');
const sequelize = require('./db/connection');

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hola desde el backend de Sigesti');
});


app.listen(5000, () => {
    console.log('Servidor corriendo en el puerto 5000');
});