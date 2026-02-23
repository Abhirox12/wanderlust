const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/utilities/wrapAsync.js")
const { isLoggedIn, isOwner, ListingValidation } = require("../middleware.js")
const ListingController = require("../controller/listings.js")
const multer = require('multer')
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage })
//mainpage
router.route("/")
    .get(ListingController.showAllListings)
    .post(isLoggedIn, ListingValidation, upload.single('Listing[image]'), wrapAsync(ListingController.listingAdding))


router.get("/create", isLoggedIn, ListingController.renderListingAddingPage)


router.route("/:id")
    .put(isLoggedIn, isOwner, ListingValidation, upload.single('Listing[image]') , ListingController.UpdatingListing)
    .delete(isLoggedIn, isOwner, ListingController.destroyListing)
    .get(ListingController.showDetailedListing)




//update route
router.get("/:id/update", isLoggedIn, isOwner, ListingController.renderUpdatingPage)




module.exports = router;