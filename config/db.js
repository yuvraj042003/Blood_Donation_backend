const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "user",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database connected successfully ${mongoose.connection.host}`.bgCyan.white);
    } catch (error) {
        console.log(`mongoDB Error ${error}.`.bgRed.white)
    }
}
module.exports = { connectDB };

