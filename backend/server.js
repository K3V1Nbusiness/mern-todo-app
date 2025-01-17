const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// routes middleware
const todoRoutes = require('./routes/todoRoutes')
app.use('/api/todos',todoRoutes);

app.get('/', (req, res) => {
    res.send("welcome to todo app")
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Connect to server
app.listen(PORT, () => {
    console.log(`server is running on PORT http://localhost:${PORT}`);
});