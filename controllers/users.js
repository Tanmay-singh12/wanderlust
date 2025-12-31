const User = require("../models/user");

// controllers/users.js

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// controllers/users.js

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to the Wanderlust!");
            res.redirect("/listings");

        });


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// controllers/users.js
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// controllers/users.js

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back to Wonderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };
// controllers/users.js

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}