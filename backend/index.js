require("dotenv").config();
const express = require("express");
const sequelize = require("./db/connection");
const registroRoute = require("./routes/registroRoute");
const loginRoute = require("./routes/loginRoute");
const usersRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const ticketsRoute = require("./routes/ticketsRoute");
const collectionsRoute = require("./routes/collectionsRoute");

const cors = require("cors");
const authMiddleware = require("./middlewares/auth").authMiddleware;

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: false,
    }),
);

// APIs públicas
app.use("/registro", registroRoute);
app.use("/login", loginRoute);
app.use("/auth", authRoute);

// API privada de prueba
app.get("/prueba", authMiddleware, (req, res) => {
    res.send("Hola desde el backend de Sigesti");
});

// APIs privadas
app.use("/users", authMiddleware, usersRoute);
app.use("/tickets", authMiddleware, ticketsRoute);
app.use("/collections", authMiddleware, collectionsRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});