const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ entended: true}));
app.use(express.json());

app.use(express.static("public"));

const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/populatedb", opts);

db.User.create({ name: "Chris Froome" })
    .then(dbUser => {
        console.log(dbUser);
    })
    .catch(({ message }) => {
        console.log(message);
    });

app.get("/notes", (req, res) => {
    db.Note.find({})
    .then(dbNote => {
        res.json(dbNote);
    })
    .catch(err => {
        res.json(dbUser);
    });
});

app.get("/user", (req, res) => {
    db.User.find({})
        .then(dbUser => {
            res.json(dbUser);
        }) 
        .catch(err => {
            res.json(err);
        });
});

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

app.get("/popoulateduser", (req, res) => {
    db.User.find({})
    .populate("notes")
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
