const Review = require("../models/Reviews.js")
const Listing = require("../models/Lists.js")

module.exports.addingReview = async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findById(id);
    let Reviews = new Review(req.body.review);
    Reviews.name = req.user._id;
    console.log(Reviews)
    List.review.push(Reviews)
    await Reviews.save()
    await List.save()
    req.flash("success", "Review added successfully")
    res.redirect(`/Listing/${id}`)
}
module.exports.destroyingReview = async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(id)
    console.log(reviewId)
    if (!req.user) {
        req.flash("error", "please login first")
        return res.redirect("/login")
    }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "review deleted successfully")
    res.redirect(`/Listing/${id}`)
}