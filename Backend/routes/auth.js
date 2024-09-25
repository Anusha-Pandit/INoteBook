const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser');
const jwt_secret = 'IAnusha';

//route1: create user using POST "/api/auth/CreateUser".......(does not require auth)
router.post('/CreateUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be alteast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //check if email already exists
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'User with this email already exists' })
        }

        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        //create a user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword
        });

        res.json(user);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("error occured");
    }
})

//route2: authenticate user using POST "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //compare password with hashed password
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "use correct credenitals" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "use correct credenitals" });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, jwt_secret);
        res.json({ authToken });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("error occured");
    }
})

//route3 : get user details "/ap/auth/getUser" login is required
router.post('/getUser', fetchUser, async (req, res) => {
    try {
         const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("error occured");
    }
})
module.exports = router