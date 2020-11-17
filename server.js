/*Psuedo Code

Create Server.js file 
    require files
    setup express route listeners
*/



const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./Develop");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));

const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", opts);

// Create a workout
db.User.create({ name: "Terry Crews" })
    .then(dbUser => {
        console.log(dbUser);
    })
    .catch(({ message }) => {
        console.log(message);
    });

app.get("/", (req, res) => {
    db.Note.find({})
    .then(dbNote => {
        res.json(dbNote);
    })
    .catch(err => {
        res.json(dbUser);
    });
});

// Track a workout
app.get("/user", (req, res) => {
    db.User.find({})
        .then(dbUser => {
            res.json(dbUser);
        }) 
        .catch(err => {
            res.json(err);
        });
});

// Submit information
app.post("/submit", ({ body}, res) => {
    db.Note.create(body)
    .then(({ _id }) => db.User.findOneandUpdate({}, { $push: { notes: _id }}, {new: true}))
    .then(dbUser => {
        res.join(dbUser);
    })
    .catch(err => {
        res.json(err);
    });
});
// populate information
app.get("/", (req, res) => {
    db.User.find({})
    .populate("----")
    .then(dbUser => {
        res.join(dbUser);
    })
    .catch(err => {
        res.join(err);
    });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
