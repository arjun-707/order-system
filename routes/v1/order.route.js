const express = require('express')
const Route = express.Router()
const { Orders } = require('../../controllers')

Route.post('/add', Orders.add)
Route.get('/list/today', Orders.list)
Route.put('/update/:id', Orders.update)
Route.put('/updateStatus/:id', Orders.updateStatus)
Route.delete('/delete/:id', Orders.remove)
Route.get('/checkCapacity/:date', Orders.capacity)

module.exports = Route