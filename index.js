const path = require("path");
const express = require("express");
const connectDB = require("./config/db")
const cors = require('cors');

const app = express();

// Connect to database
connectDB(0);

app.use(cors({origin: true, credentials: true}));
app.use(express.json({extended: false}));

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use('/', require("./routes/index"));
app.use('/url-shortener/api/url', require("./routes/url"));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

