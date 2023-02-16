const mongoose = require("mongoose");

module.exports = {
    connect: async function(){
        try {
            const connection = await mongoose.connect(process.env.MONGO_URL);
            console.log("MongoDB cloud connected")
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit();
        }
    }
}