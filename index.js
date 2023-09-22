const express = require("express");
const connectDB = require("./config/db")
const cors = require('cors');

const app = express();

// Connect to database
connectDB();

app.use(cors({origin: true, credentials: true}));
app.use(express.json({extended: false}));

app.use('/', require("./routes/index"));
app.use('/api/url', require("./routes/url"));

app.use(express.static("assets"));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

