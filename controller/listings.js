const Listing = require("../models/Lists.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });




module.exports.showAllListings = async (req, res) => {
    let Lists = await Listing.find()
    res.render("./Listings/index.ejs", { Lists })
}
module.exports.renderListingAddingPage = (req, res) => {
    res.render("./Listings/create.ejs")
}

module.exports.listingAdding = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.Listing.location,
        limit: 1
    })
        .send()

    let url = req.file.path;
    let filename = req.file.path

    const List = new Listing(req.body.Listing);
    List.owner = req.user._id;
    List.image = { url, filename }
    List.geometry = response.body.features[0].geometry;
    let saved = await List.save()
    console.log(saved)

    req.flash("success", " New Listing added successfully")
    res.redirect("/Listing")

}

module.exports.renderUpdatingPage = async (req, res) => {
    const { id } = req.params;
    let List = await Listing.findById(id);
    if (!List) {
        req.flash("error", "Listing not found")
        res.redirect("/Listing")
    }
    let originalImageUrl = List.image.url;

    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300/w_300")
    res.render("./Listings/update.ejs", { List, originalImageUrl })
}
module.exports.UpdatingListing = async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findByIdAndUpdate((id), { ...req.body.Listing }, { runValidators: true })
    console.log(req.file)
    if (req.file !== undefined) {
        let url = req.file.path;
        let filename = req.file.path
        List.image = { url, filename }
        await List.save()
    }
    req.flash("success", "Listing updated successfully")
    res.redirect(`/Listing/${id}`)
}
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted Successfully")
    res.redirect("/Listing")
}
module.exports.showDetailedListing = async (req, res) => {
    let { id } = req.params;

    let List = await Listing.findById(id).populate({
        path: "review",
        populate: {
            path: "name"
        }
    }).populate("owner");
    // console.log(List)
    if (!List) {
        req.flash("error", "Listing not found")
        res.redirect("/Listing")
    } else {
        res.render("./Listings/show.ejs", { List })
    }
}