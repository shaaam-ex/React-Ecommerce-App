const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoute = require('./routes/UserRoutes');
const productRoute = require('./routes/ProductRoutes');

let app = express();
app.use(express.json());

// app.use(bodyParser);

app.use(cors());
app.use(cookieParser());

app.use('/api/v1', userRoute);
app.use('/api/v1', productRoute);

module.exports = app;