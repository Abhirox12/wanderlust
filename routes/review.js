const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../public/utilities/wrapAsync.js")
const reviewController = require("../controller/review.js")

const { reviewValidation, isLoggedIn, isReviewAuthor } = require("../middleware.js")

//addingReview
router.post("/", isLoggedIn, reviewValidation, wrapAsync(reviewController.addingReview)
)


// Deleting Reviews

router.delete("/:reviewId", isReviewAuthor, reviewController.destroyingReview)
module.exports = router;