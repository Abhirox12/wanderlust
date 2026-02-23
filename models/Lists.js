const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Reviews.js")
const User = require("./User.js")
const defaultImage = "https://media.gettyimages.com/id/2234542218/photo/bormio-ski-resort-covered-with-snow-at-dawn.jpg?s=1024x1024&w=gi&k=20&c=c8wDlEEOVo4AAARCKnbf9_b3oyVfXK7sfFWglIe0FoE="

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        url:
        {
            type: String,
            default: defaultImage,
            set: (v) => v === "" ? defaultImage : v
        },
        filename: {
            type: String
        }
    },
    price: {
        type: Number,
        min: 500
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})


ListingSchema.post("findOneAndDelete", async (Listing) => {
    if (Listing.review.length) {
        let res = await Review.deleteMany({ _id: { $in: Listing.review } })
        console.log(res)
    }
})

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
