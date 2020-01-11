const express = require('express');
const {check, validationResult } = require('express-validator');
const router = express.Router();

// @route     GET api/users
// @desc      Users route
// @access    Public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'please enter a password with 6 or more characters').isLength({min: 6})
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.send('Users Route')
})

module.exports = router;