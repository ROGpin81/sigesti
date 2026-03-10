require('dotenv').config();
const express = require('express');
const sequelize = require('./db/connection');
const registroRoute = require('./routes/registroRoute');
const loginRoute = require('./routes/loginRoute');
const authMiddleware = require('./middlewares/auth').authMiddleware;

const app = express();

app.use(express.json());

app.use('/registro', registroRoute);
app.use('/login', loginRoute);

// API privada de prueba
app.get('/prueba', authMiddleware, (req, res) => {
    res.send('Hola desde el backend de Sigesti');
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
