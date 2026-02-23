const mongoose = require("mongoose");
const mongoUrl = 'mongodb://127.0.0.1:27017/Wanderlust';
const Listing = require("../models/Lists")
const initData = require("./data")

main().then(() => {
    console.log("connection done successfully")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(mongoUrl)
}

let initailizing = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "697c62cfa434e9495b320b98" }))
    await Listing.insertMany(initData.data)
    console.log(initData.data)
    console.log("data was initialized")

}
initailizing();