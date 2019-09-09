// Required dependencies and packages
var express = require("express");
var router = express.Router();
var db = require("../models");

//Routes
//This route will performs a POST request to create a new user
router.post("/users", function (req, res) {
    db.User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
    }).then(function (dbTranslate) {
        res.json(dbTranslate);
    });
});

//This route will perform a GET request to authenticate the user so they can log in
router.get("/auth", function (req, res) {
    db.User.findOne({
        where:
        {
            email: req.body.email,
            password: req.body.password
        }
    }).then(function (dbTranslate) {
        if (dbTranslate == null) {
            res.json({
                "Outcome Code": 401,
                "Outcome Message": "Incorrect Email or Password."
            });
        }
        else {
            res.json(
                {
                    "Outcome Code": 200,
                    "Outcome Message": "Authentication Successful!",
                    "Token": dbTranslate.id
                }
            );
        }

    });
});


//This route performs a GET request to retreive all translations for a user
router.get("/translations", function (req, res) {
    db.Translation.findAll({}).then(function (dbTranslate) {
        res.json(dbTranslate); //Returns a JSON array of all translations
    });
});

//This route performs a POST request to create a new translation record
router.post("/translations", function (req, res) {
    db.Translation.create({
        user_id: req.body.user_id,
        translated_language: req.body.translated_language,
        analyzed_keywords: req.body.analyzed_keywords,
        translated_keywords: req.body.translated_keywords
    }).then(function (dbTranslate) {
        res.json({
            "Outcome Code": 200,
            "Outcome Message": "Translation has been saved."
        });
    });
});

// Exports the translate-my-pic-plus API routes
module.exports = router;