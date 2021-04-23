const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
// MongoDB Driver
const mongoose = require('mongoose')

const port = 3000

const DB_URI = "mongodb://SIT_725_MVP:1986@cluster0-shard-00-00.rdylz.mongodb.net:27017,cluster0-shard-00-01.rdylz.mongodb.net:27017,cluster0-shard-00-02.rdylz.mongodb.net:27017/csams?ssl=true&replicaSet=atlas-7egekt-shard-0&authSource=admin&retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(DB_URI)

// CONNECTION EVENTS
mongoose.connection.once('connected', function () {
    console.log("Database connected to Mongo cloud")
})
mongoose.connection.on('error', function (err) {
    console.log("MongoDB connection error: " + err)
})
mongoose.connection.once('disconnected', function () {
    console.log("Database disconnected")
})

// If Node's process ends, close the MongoDB connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log("Database disconnected through app termination")
        process.exit(0);
    })
})

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares => before and after request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Serve Static Files from /public
app.use(express.static(path.join(__dirname, 'public')));


// Routes ----------------------------------------------
app.use('/', require('./routes/pages'))
app.use('/manager', require('./routes/manager'))
app.use('/member', require('./routes/member'))
// -----------------------------------------------------

app.listen(port, function () {
    console.log(`listening on port ${port}...`)
})
