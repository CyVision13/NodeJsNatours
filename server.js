const mongoose = require('mongoose')
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD );
const DB = process.env.DABABASE_LOCAL;

mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useMongoClient:true,
  useUnifiedTopology: true
}).then(()=> console.log('DB connection succesfull'));

const tourSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'A tour must have a name'],
    unique:true
  },
  rating: {
    type:Number,
    default:4.5
  },
  price:{
    type:Number,
    required:[true,'A tour must have a price']
  }
})
const Tour = mongoose.model('Tour',tourSchema)

const testTour = new Tour({
  name:'The park Hiker',
  rating:4.7,
  price:497 
})

testTour.save().then(doc=>{
  console.log(doc);
}).catch(err=>{
  console.log(err);
})


// console.log(process.env);

const port = process.env.PORT || 313;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
