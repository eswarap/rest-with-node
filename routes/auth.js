const express = require('express');

const router = express.Router();

const User = require('../models/user.js');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation }= require('../validation.js');

router.post('/register', async (req, res) => {

    const {error} = registerValidation(req.body);

    if (error) 
        return res.status(400).send(error.details[0].message)

    //email duplicate check
    const emailExist = await User.findOne({email:req.body.email});
    if (emailExist)
    return res.status(400).send('Email already exists');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const newUser = new User({name: req.body.name, email: req.body.email, password: hashedPassword});


    try {

        const savedUser = await newUser.save();
        res.json({user:savedUser._id});
    } catch (error) {
        res.json({message: error});
    }
});


//validate login
router.post('/login', async (req,res)=> {
    const {error} = loginValidation(req.body);

    if (error) 
        return res.status(400).send(error.details[0].message)

    //email duplicate check
    const user = await User.findOne({email:req.body.email});
    if (!user)    
        return res.status(400).send('Invalid Email');
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if (!validPass)    
        return res.status(400).send('Invalid password ');

    //Create and Assign token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    res.send("logged in");
});


module.exports = router;
