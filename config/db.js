const mongoose = require("mongoose");
const db = process.env.MONGO_URI;
const MAX_ATTEMPTS = 10;

const connectDB = async (numAttempts) => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        if(numAttempts < MAX_ATTEMPTS){ 
            console.log("Connection Error. Trying again...")
            connectDB(numAttempts+1);
        } else {
            console.error("Connection Timeout. MongoDB not connected...");
            console.error(error.message);
        }
    }  
}

module.exports = connectDB;