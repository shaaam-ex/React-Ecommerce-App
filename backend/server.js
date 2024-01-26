
let app = require('./app');
let connectDatabase = require('./config/ConnectDatabase.js');
let dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

connectDatabase();

app.listen(process.env.SV_PORT, console.log(`Server is running on the port ${process.env.SV_PORT}`));

