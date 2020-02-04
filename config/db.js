const mongoose = require('mongoose');
const config = require('config');
const URI = config.get("mongoURI");

const connectDB = async () => {
    try{
        await mongoose.connect(URI, {useNewUrlParser:true});
        console.log("COnnected to DB");
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }

}
module.exports = connectDB;