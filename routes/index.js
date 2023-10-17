const path = require("path");
const express = require("express");
const router = express.Router();

const Url  = require("../models/Url");

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/../index.html'));
});

router.get("/fish", (req, res) => {
    res.sendFile(path.join(__dirname, '/../assets/fish.html'));
});

router.get("/url-shortener", (req, res) => {
    res.sendFile(path.join(__dirname, '/../assets/shorten.html'));
});

// @route   GET /:code
// @desc    Redirect to long url
router.get('/:code', async (req, res) => {
    try{
        const url = await Url.findOne({urlCode: req.params.code});

        if(url){
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json({'res':'No url found'});
        }

    } catch(err){
        console.error(err);
        res.status(500).json('Server error: Oops!');
    }
});

module.exports = router;