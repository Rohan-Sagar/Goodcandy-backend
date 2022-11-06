const mongoose =require('mongoose');

var reviewSchema = new mongoose.Schema({
    FullName:{
        type :String,
       
    },
    Address:{
        type :String,
    },
    ZipCode:{
        type :Number,
    },
    Review:{
        type :String,
    },
    Rating:{
        type :Number,
    },
    Date:{
        type: Date, 
        default: Date.now
    },
},{collection:'userReviews',
versionKey: false
});


module.exports =  mongoose.model('userReviews', reviewSchema);

