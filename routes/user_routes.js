const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

// image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/img");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

// register a user account
router.post('/register', async (req, res) => {

    try {

        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone = req.body.phone;
        const usertype = req.body.usertype;
        const password = req.body.password;

        const checkUsername = await User.findOne({ username: username});

        const checkEmail = await User.findOne({ email: email});

        const checkPhone = await User.findOne({ phone: phone});

        // data validating 
        if(username == "") {
            return res.json({message: "Username field is required"});
        }

        if(firstname == "") {
            return res.json({message: "Firstname field is required"});
        }

        if(lastname == "") {
            res.json({message: "Lastname field is required"});
            return;
        }

        if(email == "") {
            return res.json({message: "Email field is required"});
        }

        if(usertype == "") {
            return res.json({message: "Usertype field is required"});
        }

        if(password == "") {
            return res.json({message: "Password field is required"});
        }

        if(password.length < 8) {
            return res.json({message: "Password length should be more that 7 characters!"});
        }

        if(checkUsername){
            return res.json({message: "Username already in use!"});
        }

        if(checkEmail){
            return res.json({message: "Email address already in use!"});
        }

        if(checkPhone){
            return res.json({message: "Phone number already in use!"});
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username: username.toLowerCase(),
            firstname: firstname.toLowerCase(),
            lastname: lastname.toLowerCase(),
            email: email.toLowerCase(),
            phone: phone.toLowerCase(),
            usertype: usertype.toLowerCase(),
            password: hashPassword.toLowerCase(),
            status: '0'
        });
        
        console.log(newUser);

        const result = await User.create(newUser);

        if(result) {
            console.log(result);
            res.status(200).json({message: "Account successfully created"});
            return;
            //res.redirect('/users');
            //res.status(200).json({message: "User account created successfully"});
        }

    } catch (err) {
        res.status(500).json({message: err.message});
    }
    
});

// using this to display the users data
router.get("/users", async (req, res) => {

    try {

        const users = await User.find({});

        if(users) {
            return res.status(200).json(users);
        }else {
            return res.status(500).json({message: err.message});
        }

    }catch (err) {
        return res.status(500).json({message: err.message});
    }
    //res.send("Registration Page");
});

// using this to display the users data
router.get("/users", async (req, res) => {

    try {

        const users = await User.find({});

        if(users) {
            return res.status(200).json(users);
        }else {
            return res.status(500).json({message: err.message});
        }

    }catch (err) {
        return res.status(500).json({message: err.message});
    }
    //res.send("Registration Page");
});

// find a single user account
router.get('/users/:id', async (req, res) => {

    try {

        const id = req.params.id;

        // data validating 
        if(id == "") {
            res.json({message: "User ID cannot be found"});
            return;
        }

        console.log(id);

        const result = await User.findOne({ _id: id });

        if(!result) {
            return res.status(200).json({message: "No user account found!"});
        }

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    
});

// update a user account
router.put('/users/:id', async (req, res) => {

    try {

        const id = req.params.id;
        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const phone = req.body.phone;

        // data validating 
        if(id == "") {
            res.json({message: "User ID cannot be found"});
            return;
        }

        if(username == "") {
            res.json({message: "Username field is required"});
            return;
        }

        if(firstname == "") {
            res.json({message: "Firstname field is required"});
            return;
        }

        if(lastname == "") {
            res.json({message: "Lastname field is required"});
            return;
        }

        if(phone.length < 11 && phone.length > 13) {
            res.json({message: "Phone number length should be not be more than 13 digits and less than 11 digits!"});
            return;
        }

        const newUser = new User({
            username: username,
            firstname: firstname,
            lastname: lastname,
            phone: phone,
        });

        console.log(newUser);

        const result = await User.findByIdAndUpdate({ _id: id }, { newUser });

        if(!result) {
            return res.status(200).json({message: "Failed to update account"});
        }

        // const updatedUser = await User.findById(id);

        // console.log(updatedUser);

        return res.status(200).json({message: "Account successfully updated"});

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    
});

// delete user account
router.delete('/users/:id', async (req, res) => {

    try {

        const id = req.params.id;

        // data validating 
        if(id == "") {
            return res.json({message: "User ID cannot be found"});
        }

        console.log(id);

        const result = await User.deleteOne({ _id: id });

        if(!result) {
            return res.status(200).json({message: "No user account found!"});
        }

        return res.status(200).json({ message: "User account deleted successfully!" });

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    
});

module.exports = router;
