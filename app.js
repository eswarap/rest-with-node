const express = require('express')

//middleware
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());
app.use(express.json());
// Use env variables
require('dotenv').config();


// Import routes
const postRoute = require('./routes/posts.js');
const authRoute = require('./routes/auth.js');

app.use('/api/posts', postRoute);
app.use('/api/user', authRoute);

// Connect to mongodb
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PWD,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to DB');
    app.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:`,process.env.PORT);
    });
}).catch(err => console.log(err));

// Home Route
app.get('/', (req, res) => {
    res.send("Hello world");
})
