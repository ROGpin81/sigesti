require("dotenv").config();
const express = require("express");
const path = require("path");
const sequelize = require("./db/connection");
const registroRoute = require("./routes/registroRoute");
const loginRoute = require("./routes/loginRoute");
const usersRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const ticketsRoute = require("./routes/ticketsRoute");
const collectionsRoute = require("./routes/collectionsRoute");
const filesRoutes = require("./routes/files.routes");

const cors = require("cors");
const authMiddleware = require("./middlewares/auth").authMiddleware;

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/*app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: false,
    }),
);*/

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "src/uploads"))
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
app.use("/api", filesRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});