const express = require("express");
const router = express.Router();
const shortid = require('shortid');
const config = require('config');
const validUrl = require('valid-url');

const Url = require("../models/Url");


// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
    console.log("LongUrl: "+req.body);
    const {longUrl} = req.body;
    const baseUrl = validUrl.isUri(req.get('origin')) ? req.get('origin') : "http://localhost:5000";

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

            console.log("Url: "+url);

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