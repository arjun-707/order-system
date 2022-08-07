const mongoose = require('mongoose')
const connectMongo = async (mongoURI = CONFIG.mongo.uri) => await mongoose.connect(mongoURI)
module.exports = {
  connectMongo
}