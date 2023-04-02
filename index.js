require("dotenv").config();
const express = require("express");
const movieRoutes = require("./routes/movies");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/movies", require("./routes/movies"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));