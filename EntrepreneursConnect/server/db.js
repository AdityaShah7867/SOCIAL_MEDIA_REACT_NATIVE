const mongoose = require('mongoose')
require('dotenv').config();
const monoUrl = process.env.MONGO_URl;


module.exports.myDb = () => {
    try {
        mongoose.connect(monoUrl)
            .then(() => [
                console.log("DB CONNECTED")
            ])
    } catch (error) {
        console.log(error)
    }

}