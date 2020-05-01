const POST = 3000

const express = require('express')
const app = express()
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const bodyParser = require('body-parser')

const config = require('./db')
const dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.db
}

const routes = require('./routes/index');

app.use(express.static(__dirname + '/public'));
app.use(myConnection(mysql, dbOptions, 'pool'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use("/", routes)
app.listen(POST, () => {
    console.log('BACKEND - Restaurant running on PORT :' + POST)
})
