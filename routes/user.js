const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");
const usersControllers = require("../controllers/users");

//user route placeholder

router.get("/signup",usersControllers.renderSignupForm );

//signup logic
router.post("/signup", wrapAsync(usersControllers.signup));

//login route placeholder
router.get("/login", usersControllers.renderLoginForm );

//login logic

router.post("/login",
    saveRedirectUrl, 
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    usersControllers.login
);

//logout route

router.get("/logout", usersControllers.logout );



module.exports = router;