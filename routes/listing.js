const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// JOI VALIDATION MIDDLEWARE

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errMsg, 400);
  } else {
    next();
  }         
};

// //index route

// router.get("/",
//   wrapAsync(listingControllers.index)
// );


// //new route

// router.get("/new", isLoggedIn, listingControllers.renderNewForm);


// //show route

// router.get("/:id", wrapAsync(listingControllers.showListing));


// //create route

// router.post("/", isLoggedIn,
//   validateListing, 
//   wrapAsync(listingControllers.createListing)
// );

// //edit route

// router.get("/:id/edit", isLoggedIn, 
//     isOwner,
//   wrapAsync(listingControllers.renderEditForm));


// //update route

// router.put("/:id", isLoggedIn,
//     isOwner,
//   validateListing,
//    wrapAsync(listingControllers.updateListing));

// //delete route

// router.delete("/:id", isLoggedIn,
//     isOwner,
//    wrapAsync(listingControllers.deleteListing));

// module.exports = router;


// INDEX + CREATE  →  "/"
router.route("/")
  .get(wrapAsync(listingControllers.index))             // index
  .post(
    isLoggedIn,
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingControllers.createListing)         // create
  );
  

// NEW form  →  "/new"  (must be BEFORE /:id)
router.get("/new",
  isLoggedIn,
  listingControllers.renderNewForm
);


// SHOW + UPDATE + DELETE  →  "/:id"
router.route("/:id")
  .get(wrapAsync(listingControllers.showListing))       // show
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingControllers.updateListing)         // update
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.deleteListing)         // delete
  );


// EDIT form  →  "/:id/edit"
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)

);


module.exports = router;
