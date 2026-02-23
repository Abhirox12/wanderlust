const Listing = require("./models/Lists.js");
const Review = require("./models/Reviews.js");
const expresserror = require("./public/utilities/expresserror.js")
const { ListingSchema, reviewSchema } = require("./validationSchema.js")



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in")

        return res.redirect("/login")
    }
    next()
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let List = await Listing.findById(id)
    if (!List.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of the Listing")
        return res.redirect(`/Listing/${id}`)
    }
    next();
}

module.exports.ListingValidation = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body)
    // console.log(error)
    if (error) {
        throw new expresserror(400, error)
    }
    else {
        next()
    }
}
module.exports.reviewValidation = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    // console.log(error)

    if (error) {
        throw new expresserror(400, error)
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;
    let review = await Review.findById(reviewId)
    console.log(review.name)
    console.log(res.locals.currUser)
    if (!res.locals.currUser) {
        req.flash("error", "you don't have the authorization")
        return res.redirect(`/Listing/${id}`)

    } else if (!review.name._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of the review")
        return res.redirect(`/Listing/${id}`)
    }
    next();
}