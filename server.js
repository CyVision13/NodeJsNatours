const mongoose = require('mongoose')
const dotenv = require('dotenv');


dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD );
const DB = process.env.DABABASE_LOCAL;



mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  // useMongoClient:true,
  useUnifiedTopology: true
}).then(()=> console.log('DB connection succesfull!'))
// .catch(err => console.log('ERROR'););


// const testTour = new Tour({
//   name:'The park Hiker',
//   rating:4.7,
//   price:497 
// })

// testTour.save().then(doc=>{
//   console.log(doc);
// }).catch(err=>{
//   console.log(err);
// })


// console.log(process.env);

const port = process.env.PORT || 313;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Debugging Node With NDB 100%


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting Down...');
  console.log(err.name , err.message);
  server.close(()=>{
    process.exit(1);
  })
  
})


process.on('uncaughtException',err=>{
  console.log('UNCAUGHT EXCEPTION! Shutting Down...');
  console.log(err.name , err.message);
  process.exit(1);
  
})

// console.log(x);