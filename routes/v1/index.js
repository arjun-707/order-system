const express = require('express')
const app = express()

app.use('/orders', require('./order.route'));

module.exports = app;
