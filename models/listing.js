const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    location: String,
    image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default:
        "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg/"
    }
  },
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },        
    
    geometry: {
        type: {
            type: String,   
            enum: ['Point'],
            required: true
        },      
        coordinates: {
            type: [Number],
            required: true
        }
    }   

});


// Middleware to delete associated reviews when a listing is deleted

listingSchema.post('findOneAndDelete', async function(listing) {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }                           
});   

module.exports = mongoose.model('listing', listingSchema);
