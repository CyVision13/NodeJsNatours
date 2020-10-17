const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// const User = require('./userModel')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim:true,
    maxlength:[40,'A tour name must have les or equal 40 characters'],
    minlength:[10,'A tour name must have les or equal 10 characters'],
    // validate : [validator.isAlpha , 'Tour name must only contain characters. ']
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
    required:[true, 'A tour must have a difficulty'],
    enum: {
      values : ['easy','medium','difficult'],
      message: 'Difficulty is either : easy , medium , difficult'
    }

  }, 
  ratingAverage: {
    type: Number,
    default: 4.5,
    min:[1,'Rating must be above 1.0'],
    max:[5,'Rating must be above 5.0'] ,
    set:val => Math.round(val*10) /10
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount:{
    type:Number,
    validate: {
      validator: function(val){
        // this only points to current doc on New document creation not updateing
        return val < this.price; 
      },
      message:'Discount price ({VALUE}) should be below regular price'
    }
    
    
    
  },
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
  },
  startLocation:{
    // GeoJson (specially for mongodb)
    type:{
      type: String,
      default:'Point',
      enum: ['Point']
      }
    ,
    coordinates: [Number],
    address: String,
    description:String
  },
  locations:[
    {
      type:{
        type:String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description:String,
      day:Number
    }
  ],
  guides : [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
},{ // Object for Options 
  toJSON: { virtuals : true},
  toObject: { virtuals : true},
});

// tourSchema.index({price:1})   and we need to delete this from db 
tourSchema.index({price: 1,ratingAverage: -1})   
tourSchema.index({slug : 1})
tourSchema.index({startLocation: '2dsphere'})

tourSchema.virtual('durationWeeks').get(function(){ // we can not use virtual in query cz this is not in db
  return this.duration /  7
})

// Virtual populate
tourSchema.virtual('reviews',{
  ref:'Review', 
  foreignField: 'tour',
  localField:'_id'
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

// way 1) implement for both
// tourSchema.pre('find',function(next){
//   this.find({secretTour:{$ne:true}})
//   // this.find({secretTour:{$eq:true}})
//   next();
// })
// tourSchema.pre('findOne',function(next){
//   this.find({secretTour:{$ne:true}})
//   // this.find({secretTour:{$eq:true}})
//   next();
// })

// way 2) use regular expression

tourSchema.pre(/^find/,function(next){ 
  this.find({secretTour:{$ne:true}})


  this.start = Date.now();
  // this.find({secretTour:{$eq:true}})
  next();
})

tourSchema.pre(/^find/,function(next){
  this.populate({ // this points to current query
    path:'guides',
    select: '-__v -passwordChagedAt'
  
  });

  next();
})

tourSchema.post(/^find/, function(docs,next) {
  console.log(`Query took ${Date.now() - this.start } milliseconds!`);
  // console.log(docs);
  next();
})


tourSchema.pre('save',function (next){
  this.slug = slugify(this.name, { lower:true});
  next();
})

// for Embedding section 
// tourSchema.pre('save', async function(next){
//   const guidesPromises = this.guides.map(async id => User.findById(id))
//   this.guides = await Promise.all(guidesPromises);
// })

// AGGREGATION MIDDLEWARE 
// tourSchema.pre('aggregate',function(next){
  
//   this.pipeline().unshift({ $match : {secretTour : {$ne : true }}})

//   console.log(this);
//   next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
