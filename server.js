require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000 //process environment will check the prot ( imporant if we deploy our applicaiton)
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
//Database connection

function connectToDatabase() {
  const url = 'mongodb://127.0.0.1:27017/pizza';

  mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Database connected...');
    })
    .catch((err) => {
      console.error('Connection failed...', err);
    });
}
                                                                                        
// Call the function to initiate the database connection
connectToDatabase();

//Session config 



app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store:  MongoDbStore.create({
    client:  mongoose.connection.getClient()
  }),
  // store: new MongoDbStore({ mongooseConnection: mongoose.connection }),

  saveUninitialized : false,
  cookie:{ maxAge: 1000*60*60*24} //24 hours
}))

 app.use(flash())
//Assets

app.use(express.static('public'))
app.use(express.json())  //to enable json data reciving

//Global middleware(to access session in normal frontend)
app.use((req,res,next) =>{
  res.locals.session = req.session
  next() // we must call next because req will be stuck here
})


//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


//All the web routes
require('./routes/web')(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})