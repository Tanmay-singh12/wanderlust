const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");


//create review controller

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Reviews(req.body.review);
  newReview.author = req.user._id;
  //console.log(newReview);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
    req.flash("success", "Review added successfully");

 // res.send("Review added successfully");
 // console.log("Review added successfully");
 res.redirect(`/listings/${listing._id}`);


};

//delete review controller

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};