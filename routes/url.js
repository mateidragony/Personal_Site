const express = require("express");
const router = express.Router();
const shortid = require('shortid');
const config = require('config');
const validUrl = require('valid-url');

const Url = require("../models/Url");


// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
    const {longUrl} = req.body;
    const baseUrl = window.location.href;

    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base url');
    }

    // Generate Url code
    const urlCode = shortid.generate();
    if(validUrl.isUri(longUrl)){
        // Check if url is in db
        try{
            let url = await Url.findOne({ longUrl })

            if (!url) {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl, 
                    urlCode,
                    date: new Date()
                });

                await url.save();
            }

            res.json(url);

        } catch (err){
            console.error(err);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(401).json("Invalid long url");
    }

});



module.exports = router;