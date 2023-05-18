const mongoose = require("mongoose")

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!")
})

mongoose.connection.on("error", (err) => {
    console.error("mongo connection error: ", err)
})

function mongoConnect() {
    mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}
