const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//new route


module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

//show route

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }, 
    })
    .populate('owner');
    if(!listing){
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
    //console.log(listing);

};

//create route

module.exports.createListing = async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();


  let url = req.file.path;
  let filename = req.file.filename;
    const data = req.body.listing;
    const newListing = new Listing(data);

    // Create new listing with geometry data from Mapbox
  newListing.geometry = response.body.features[0].geometry;

  // ✅ If user didn’t enter an image URL, remove image field
  if (!data.image?.url || data.image.url.trim() === "") {
    delete data.image;
  }

  newListing.owner = req.user._id; // Assign the logged-in user as the owner
  newListing.image = { filename: filename, url: url };
  await newListing.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};


//edit route


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

     if(!listing){
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", { listing });
};


//update route


module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const data = req.body.listing;

  // ✅ If user didn’t enter an image URL, remove image field
  if (!data.image?.url || data.image.url.trim() === "") {
    delete data.image;
  }

  let listing = await Listing.findByIdAndUpdate(id, data);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
 
  listing.image = { filename: filename, url: url };
  await listing.save();
} 

  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

//delete route


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};