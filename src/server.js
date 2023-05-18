require("dotenv").config()

const http = require("http")
const app = require("./app")

const server = http.createServer(app)
const PORT = process.env.PORT || 7001
const { mongoConnect } = require("./services/mongo")

server.listen(PORT, () => {
    mongoConnect()
    console.log(`Listen on port ${PORT}...`)
})
