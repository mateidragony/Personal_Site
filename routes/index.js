const express = require("express");
const router = express.Router();

const Url  = require("../models/Url");

router.get("/", (req, res) => {
    res.sendFile(__dirname+"../index.html");
});

// @route   GET /:code
// @desc    Redirect to long url
router.get('/:code', async (req, res) => {
    try{
        const url = await Url.findOne({urlCode: req.params.code});

        if(url){
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('No url found');
        }

    } catch(err){
        console.error(err);
        res.status(500).json('Server error: Oops!');
    }
});

module.exports = router;