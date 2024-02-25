const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


// REGISTER
router.post('/register', async (req, res) => {

    try {
        //GENERATE NEW ENCRYPTED PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //CREATE NEW USER ACCOUNT
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //SAVE USER AND RESPOND
        const user = await newUser.save();
        res.status(200).json(user);
        res.setHeader('Access-Control-Allow-Origin', 'https://main--freedomnet-social.netlify.app/');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);

    } catch (err) {
        res.status(500).json(err);
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send('user not found');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json('incorrect password');

        res.status(200).json(user);
        res.setHeader('Access-Control-Allow-Origin', 'https://main--freedomnet-social.netlify.app/');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);

    } catch (err) {
        res.status(500).json(err);
    }
})



module.exports = router;