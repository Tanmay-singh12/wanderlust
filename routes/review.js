const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');
const Reviews = require('../models/review.js');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewControllers = require("../controllers/reviews.js");
//const Review = require('../models/review.js');


// JOI VALIDATION MIDDLEWARE

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }         
};

//review route placeholder
//post route

router.post("/", 
  isLoggedIn,
  validateReview,
   wrapAsync(reviewControllers.createReview));    


//delete review route placeholder

router.delete("/:reviewId", 
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.deleteReview)); 

module.exports = router;