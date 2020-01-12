const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
// @route     GET api/profile/me
// @desc      Get current user profile
// @access    Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id})
        //we need to bring name and avatar from user model and not from profile model. we can get it so using populate method
        .populate('user', ['name','avatar']);
        if(!profile){
            res.status(400).json({msg: 'There is no profile for this user'})
        }
        res.json(profile);
    }catch(err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})

module.exports = router;