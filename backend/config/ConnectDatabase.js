const mongoose = require('mongoose');

let ConnectDatabase = async () => {
    await mongoose.connect(process.env.DB_URL).then((dt) => console.log("DB Connected Successfully")).catch("There is an issue connecting to the database")

    return;
}

module.exports = ConnectDatabase;