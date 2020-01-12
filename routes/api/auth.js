const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route     GET api/auth
// @desc      Auth route
// @access    Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // select('-password') will leave of the password in data
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route     GET api/auth
// @desc      Authenticate User and get his token
// @access    Public

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;

    try {
        // See if user exists
        let user = await User.findOne({email});

        if(!user) {
            res.status(400).json({errors:[{msg: 'Invalid credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            res.status(400).json({errors:[{msg: 'Invalid credentials'}]});
        }
        
        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600
        },
        (err,token) => {
            if(err) throw err;
            res.json({token});
        })
        //res.send('User Registered')
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;