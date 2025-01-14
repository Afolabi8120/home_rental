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
            return res.status(400).json({message: "Username field is required"});
        }

        if(firstname == "") {
            return res.json({message: "Firstname field is required"});
        }

        if(lastname == "") {
            return res.status(400).json({message: "Lastname field is required"});
        }

        if(email == "") {
            return res.status(400).json({message: "Email field is required"});
        }

        if(usertype == "") {
            return res.status(400).json({message: "Usertype field is required"});
        }

        if(password == "") {
            return res.status(400).json({message: "Password field is required"});
        }

        if(password.length < 8) {
            return res.status(400).json({message: "Password length should be more that 7 characters!"});
        }

        if(checkUsername){
            return res.json({message: "Username already in use!"});
        }

        if(checkEmail){
            return res.status(400).json({message: "Email address already in use!"});
        }

        if(checkPhone){
            return res.status(400).json({message: "Phone number already in use!"});
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username: username.toLowerCase(),
            firstname: firstname.toLowerCase(),
            lastname: lastname.toLowerCase(),
            email: email.toLowerCase(),
            phone: phone.toLowerCase(),
            usertype: usertype.toLowerCase(),
            password: hashPassword,
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
            res.status(400).json({message: "User ID cannot be found"});
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
        const email = req.body.email;

        // data validating 
        if(id == "") {
            return res.status(400).json({message: "User ID cannot be found"});
        }

        if(username == "") {
            return res.status(400).json({message: "Username field is required"});
        }

        if(firstname == "") {
            return res.status(400).json({message: "Firstname field is required"});
        }

        if(lastname == "") {
            return res.status(400).json({message: "Lastname field is required"});
        }

        if(email == "") {
            return res.status(400).json({message: "Email address field is required"});
        }

        if(phone.length < 11 && phone.length > 13) {
            return res.status(400).json({message: "Phone number length should be not be more than 13 digits and less than 11 digits!"});
        }

        console.log(id);

        const result = await User.findByIdAndUpdate(id, 
            {
               $set : {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                    email: email
                }
            });

        if(!result) {
            return res.status(400).json({message: "Failed to update account"});
        }

        return res.status(200).json({message: "Account successfully updated"});

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
    
});

// update a user password
router.put('/change_password/:id', async (req, res) => {

    try {

        const id = req.params.id;
        const oldpassword = req.body.oldpassword;
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        const userData = await User.findOne({ _id: id});

        // data validating 
        if(id == "") {
            return res.status(400).json({message: "User ID cannot be found"});
        }

        if(oldpassword == "") {
            return res.status(400).json({message: "Old password field is required"});
        }

        if(password == "") {
            return res.status(400).json({message: "Password field is required"});
        }

        if(cpassword == "") {
            return res.status(400).json({message: "Confirm password field is required"});
        }

        if(password != cpassword) {
            return res.status(400).json({message: "Both password do not match!"});
        }

        if(password.length < 8 ) {
            return res.status(400).json({message: "Phone number length should be not be more than 7 digits!"});
        }

        // compare password 
        const fetchedPassword = bcrypt.compareSync(oldpassword, userData.password);

        console.log(fetchedPassword);

        if(!fetchedPassword) {
            return res.status(400).json({ message: "Old password do not match!" });
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const result = await User.findByIdAndUpdate(id, 
            {
               $set : {
                    password: hashPassword
                }
            });

        if(!result) {
            return res.status(400).json({message: "Failed to update account"});
        }

        return res.status(200).json({message: "Password successfully updated"});

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
