const mongoose = require('mongoose')
const dotenv = require('dotenv')

const URL = process.env.DATABASE

const connectDB = async () => {
    try{
        await mongoose.connect(
            URL,
            {
                useNewUrlParser : true,
                useUnifiedTopology : true,
            },
            () => {
                console.log("MongoDB connected...");
            }
        )
    }catch(err){
        console.log("error message is : " + err.message);
        process.exit(1)
    }
}

module.exports = connectDB