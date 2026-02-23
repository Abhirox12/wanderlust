const User = require("../models/User");



module.exports.renderingSignupform = (req, res) => {
    res.render("Listings/signup")
}

module.exports.signup = async (req, res) => {
    try {

        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        let registerUser = await User.register(newUser, password)
        console.log(registerUser)
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "user Added successfully")
            res.redirect("./Listing")
        })
    }
    catch (err) {
        req.flash("error", err.message)
        res.redirect("./signup")
    }

}

module.exports.renderingLogingform = (req, res) => {
    res.render("Listings/login")
}


module.exports.login = async (req, res) => {
    let { username } = req.body;
    req.flash("success", `welcome back ${username}`)
    console.log(req.session)
    const redirectUrl = res.locals.redirectUrl || "/Listing";
    console.log(redirectUrl)
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "user logged out successfully")
        res.redirect("/Listing")
    })
}

module.exports.loginforReview =  (req, res) => {
    let { id } = req.params;
    res.redirect(`/Listing/${id}`)
}