const moment = require('moment')
const { Orders } = require('../models')
const { SuccessMsg, ErrorMsg, getCurrentDateTime } = require('../utils')

const add = async (req, res) => {
  try {
    if (!req.body.amount) return res.status(400).send(ErrorMsg.amountErr)
    if (isNaN(req.body.amount)) return res.status(400).send(ErrorMsg.amountNumErr)
    if (!req.body.productId) return res.status(400).send(ErrorMsg.productIdErr)
    if (!req.body.orderBy) return res.status(400).send(ErrorMsg.orderByErr)
    const {
      currentDate,
      currentStartDateTime,
      currentEndDateTime
    } = getCurrentDateTime()
    if (!global.CONFIG.capacity[currentDate]) global.CONFIG.capacity[currentDate] = global.CONFIG.MAX_CAPACITY
    const orderCount = await Orders.count({
      createdAt: {
        $gte: currentStartDateTime,
        $lte: currentEndDateTime
      }
    })
    if (orderCount < global.CONFIG.capacity[currentDate]) {
      const requiredFields = [
        'amount',
        'productId',
        'orderBy'
      ]
      Object.keys(req.body).forEach(eachKey => {
        if (!requiredFields.includes(eachKey)) delete req.body[eachKey]
      })
      const newOrder = await Orders.create(req.body)
      newOrder.orderId = newOrder._id
      delete newOrder._id
      return res.status(200).send({
        capacityRemaining: global.CONFIG.capacity[currentDate],
        data: newOrder,
        ...SuccessMsg.ordered
      })
    } else return res.status(400).send(ErrorMsg.capacityReachedErr)
  } catch (ex) {
    return res.status(500).send({ error: ex.message, ...ErrorMsg.internal })
  }
}
const list = async (req, res) => {
  try {
    const {
      currentDate,
      currentStartDateTime,
      currentEndDateTime
    } = getCurrentDateTime()
    const orderDetails = await Orders.find({
      createdAt: {
        $gte: currentStartDateTime,
        $lte: currentEndDateTime
      },
      isDeleted: false
    }).limit(global.CONFIG.capacity[currentDate]).lean().exec()
    if (!orderDetails) return res.status(400).send(ErrorMsg.notFoundErr)
    return res.status(200).send({
      data: orderDetails.map(eachOrder => {
        const orderId = eachOrder._id
        delete eachOrder._id
        delete eachOrder.__v
        return {
          orderId,
          ...eachOrder
        }
      }),
      message: SuccessMsg.list
    })
  } catch (ex) {
    return res.status(500).send({ error: ex.message, ...ErrorMsg.internal })
  }
}
const update = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send(ErrorMsg.orderIdErr)
    const orderDetails = await Orders.findOne({
      _id: req.params.id,
      isDeleted: false
    })
    if (!orderDetails) return res.status(400).send(ErrorMsg.notFoundErr)
    Object.assign(orderDetails, req.body)
    const updatedOrder = await orderDetails.save()
    updatedOrder.orderId = updatedOrder._id
    delete updatedOrder._id
    return res.status(200).send({
      data: updatedOrder,
      message: SuccessMsg.updated
    })
  } catch (ex) {
    return res.status(500).send({ error: ex.message, ...ErrorMsg.internal })
  }
}
const updateStatus = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send(ErrorMsg.orderIdErr)
    const orderDetails = await Orders.findOne({
      _id: req.params.id,
      isDeleted: false
    })
    if (!orderDetails) return res.status(400).send(ErrorMsg.notFoundErr)
    Object.assign(orderDetails, { status: req.body.status })
    const updatedOrder = await orderDetails.save()
    updatedOrder.orderId = updatedOrder._id
    delete updatedOrder._id
    return res.status(200).send({
      data: updatedOrder,
      message: SuccessMsg.status
    })
  } catch (ex) {
    return res.status(500).send({ error: ex.message, ...ErrorMsg.internal })
  }
}
const remove = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).send(ErrorMsg.orderIdErr)
    const orderDetails = await Orders.findOne({
      _id: req.params.id,
      isDeleted: false
    })
    if (!orderDetails) return res.status(400).send(ErrorMsg.notFoundErr)
    Object.assign(orderDetails, { isDeleted: true, deletedBy: req.body.deletedBy })
    await orderDetails.save()
    return res.status(200).send({
      message: SuccessMsg.deleted
    })
  } catch (ex) {
    return res.status(500).send({ error: ex.message, ...ErrorMsg.internal })
  }
}
const capacity = async (req, res) => {
  try {
    if (!req.params.date) return res.status(400).send(ErrorMsg.dateErr)
    if (!moment(req.params.date)) return res.status(400).send(ErrorMsg.invalidDateErr)
    const {
      currentDate,
      currentStartDateTime,
      currentEndDateTime
    } = getCurrentDateTime(req.params.date)
    if (!global.CONFIG.capacity[currentDate]) global.CONFIG.capacity[currentDate] = global.CONFIG.MAX_CAPACITY
    const orderCount = await Orders.count({
      createdAt: {
        $gte: currentStartDateTime,
        $lte: currentEndDateTime
      }
    })
    return res.status(200).send({
      capacityRemaining: global.CONFIG.capacity[currentDate],
      data: {
        capacityRemaining: global.CONFIG.capacity[currentDate] - orderCount
      },
      message: SuccessMsg.capacity
    })
  } catch (ex) {
    return res.status(500).send({ error: ex.message, ...ErrorMsg.internal })
  }
}
module.exports = {
  add,
  list,
  update,
  updateStatus,
  remove,
  capacity
}