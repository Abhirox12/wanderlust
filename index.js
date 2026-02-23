if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const ejs = require("ejs")
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const DBurl = process.env.DBurl;
const ejsMate = require("ejs-mate")
const expresserror = require("./public/utilities/expresserror.js")
const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const flash = require("connect-flash")
const session = require("express-session")
const MongoStore = require('connect-mongo').default;
const passport = require("passport")
const User = require("./models/User.js")
const LocalStrategy = require("passport-local")
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "/public")))
app.use(flash())


const store = MongoStore.create({
    mongoUrl: DBurl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

store.on("error", (err) => {
    console.log("Error in Mongo session", err)  
})

app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())




app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next()
})
main().then(() => {
    console.log("connection done successfully")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(DBurl);
}
app.use("/Listing", listingRouter)
app.use("/Listing/:id/review", reviewRouter)
app.use("/", userRouter)

app.get("/registerUser", async (req, res) => {
    let fakeuser = new User({
        email: "student@gmail.com",
        username: "delta-student",
    })
    let newUser = await User.register(fakeuser, "helloworld");
    res.send(newUser)
})

app.use((req, res, next) => {
    next(new expresserror(404, "Route not found"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message } = err;

    console.log(err)
    res.status(statusCode).render("./Listings/error.ejs", { message })
})




app.listen(8080, () => {
    console.log("App is Listening at 8080")
})

