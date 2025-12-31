if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}       

require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
//const Listing = require('./models/listing.js');
//const ExpressError = require("./utils/ExpressError.js");  
const session = require('express-session');
const MongoStore = require('connect-mongo').default;


const flash = require('connect-flash');
//const Reviews = require('./models/review.js');


const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');



app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

DB_URL = process.env.ATLAS_DB_URL;


main().then(() => {
    console.log("Connected to MongoDB");
})  
.catch((err) =>{ console.log(err);

});

async function main() {
  await mongoose.connect(DB_URL);
}


//home route

// app.get("/", (req, res) => {
//     res.send("Hello, World!");
// });

//session store

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
    console.log("session store error", e);
}); 

//session configuration

const sessionOption = {
     store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOption));
app.use(flash());

//console.log("TYPE =", typeof MongoStore);





//passport configuration

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash middleware

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});  


  
//routes

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//error handling middleware


app.use((err, req, res, next) => {
    let {message = "Something went wrong", statusCode = 500} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {                                
    console.log("Server is listening to port 8080");          
}); 


// app.get("/testlisting", async (req, res) => {
    //     const sampleListing = new listing({
        //         title: "my new villa",
        //         description:"by the beach",
        //         price: 500,
        //         location: "goa",
        //         country: "usa",
        //     });
        //     await sampleListing.save();
        //     console.log("sample was saved");
        //     res.send("Listing saved");
        // });
        
        // app.all("*", (req, res, next) => {
            //     next(new ExpressError("Page Not Found", 404));
            // });
            
            //create route
            
            
            // app.post("/listings", async (req, res) => {
            //     const newListing = new Listing(req.body.listing);
            //     await newListing.save();
            //     res.redirect("/listings");
            // });
            
            
            // app.post("/listings", async (req, res) => {
            //   const data = req.body.listing;
            
            //   // if user entered only an image URL
            //   if (typeof data.image === "string") {
            //     data.image = {
            //       filename: "listingimage",
            //       url: data.image
            //     };
            //   }
            
            //   const newListing = new Listing(data);
            //   await newListing.save();
            //   res.redirect("/listings");
            // });
            
            
            
            
            //update route 
            
            // app.put("/listings/:id", async (req, res) => {
            //     let { id } = req.params;
            //     await Listing.findByIdAndUpdate(id, { ...req.body.listing});
            //     res.redirect(`/listings/${id}`);
            // });
            
            // app.put("/listings/:id", async (req, res) => {
            //   const { id } = req.params;
            //   const data = req.body.listing;
            
            //   if (typeof data.image === "string") {
            //     data.image = {
            //       filename: "listingimage",
            //       url: data.image
            //     };
            //   }
            
            //   await Listing.findByIdAndUpdate(id, data);
            //   res.redirect(`/listings/${id}`);
            // });
