const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    name:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review;