
 class APIFeatures {
    constructor(query,queryString){
      this.query = query; // = mongo db query
      this.queryString = queryString; // = req.query
    }
  
    filter(){
      const queryObj = {...this.queryString}
      const excludedFields = ['page','sort','limit','fields'];
      excludedFields.forEach(el=> delete queryObj[el])
   
      // 2) Advanced query
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match =>`$${match}`);
  
  
  
      this.query = this.query.find(JSON.parse(queryStr))
      // let query = Tour.find(JSON.parse(queryStr));
  
      return this; // entire Object
  
    }
    sort(){
      if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
        // console.log(sortBy);
        this.query = this.query.sort(sortBy)
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this; // entire Object
    }
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields)
      } else {
        this.query = this.query.select('-__v')
      }
  
      return this; // entire Object
  
    }
  
    paginate(){
      const page = this.queryString.page * 1 || 1 // converting to string with * 1
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit)
  
      // if(this.queryString.page){
      //   const numTours = await Tour.countDocuments();
   
      //   // throw err to immidiately go to Catch  Section
      //   if(skip>=numTours) throw new Error('This page does not exist')
      // }
  
      return this;
    }
  }

  module.exports = APIFeatures;