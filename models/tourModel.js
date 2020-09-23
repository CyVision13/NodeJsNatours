const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim:true
  },
  slug: {
    type: String,
    
  },
  duration:{
    type:Number,
    required:[true,'A tour must have a duration']
  },
  maxGroupSize:{
    type:Number,
    required:[true, 'A tour must have a group Size']
  },
  difficulty:{
    type:String,
    required:[true, 'A tour must have a difficulty']

  }, 
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount:Number,
  summary:{
    type:String,
    trim:true,
    required:[true, 'A tour must have a description'],
  },
  description:{
    type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt:{
    type:Date,
    default:Date.now(),
    select:false
  },
  startDates:[Date],
  secretTour: {
    type:Boolean,
    default:false
  }
},{ // Object for Options 
  toJSON: { virtuals : true},
  toObject: { virtuals : true},
});


tourSchema.virtual('durationWeeks').get(function(){ // we can not use virtual in query cz this is not in db
  return this.duration /  7
})
  // DOCUMENT MIDDLEWARE runs before .save() and .create() not in insertMany()
tourSchema.pre('save',function (next){
  this.slug = slugify(this.name, { lower:true});
  next();
})
// tourSchema.pre('save',function (next){
//   console.log('Will save document...');
//   next();
// })

// tourSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();

// })

// QUERY MIDDLEWARE
tourSchema.pre('find',function(next){
  this.find({secretTour:{$ne:true}})
  // this.find({secretTour:{$eq:true}})
  next();
})

tourSchema.pre('save',function (next){
  this.slug = slugify(this.name, { lower:true});
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
