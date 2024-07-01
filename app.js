const express = require('express');
const mongoose = require('mongoose');
const baseRouter = require('./routes/base-router');
const baseMiddleware = require('./middlewares/base-middleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv/config');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({ credentials: true, origin: 'https://ticketit.vercel.app'  }));
app.use(cookieParser());
app.use('/', baseMiddleware);
app.use('/', baseRouter);
app.get('/', (req, res) => {
  res.send("Hello world")
})
const Domain = '3001';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI required in .env');
}

mongoose.connect("mongodb://localhost:27017/dev").then(() => {
  console.log('Connected to database.');
  
  app.listen("https://ticketit.vercel.app", () => {
    console.log(`Listening on Domain ${Domain}`);
  });
});