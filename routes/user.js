const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utilities/wrapAsync");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js")
const userController = require("../controller/user.js")
const passport = require("passport")

router.route("/signup")
    .get(userController.renderingSignupform)
    .post(wrapAsync(userController.signup))


router.route("/login")
    .get(userController.renderingLogingform)
    .post(saveRedirectUrl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }), userController.login
    );

router.get("/logout", userController.logout)


router.get("/login/:id", isLoggedIn, userController.loginforReview)














module.exports = router;