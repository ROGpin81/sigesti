require('dotenv').config();
const express = require('express');
const sequelize = require('./db/connection');

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hola desde el backend de Sigesti');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
