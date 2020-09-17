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
}).then(()=> console.log('DB connection succesfull');
)

// console.log(process.env);

const port = process.env.PORT || 313;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
