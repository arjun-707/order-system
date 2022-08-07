const express = require('express')
const { connectMongo } = require('./lib')
const routes = require('./routes/v1')
global.CONFIG = require('./configs/global.config')
const { ErrorMsg } = require('./utils')
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/v1', routes);
app.use((req, res, next) => {
  res.status(404).send(ErrorMsg.urlNotFoundErr);
});
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

const start = async () => {
  await connectMongo()
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`app is running at port: ${port}`)
  })
}
start()