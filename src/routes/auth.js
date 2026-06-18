const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt")

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    // Encrypt the password.
    const { password, firstName, lastName, emailId, password } = req.body;

    const passwordHash = bcrypt.hash(password, 10); // saltrounds = 10

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error adding the user: " + error.message);
  }
});


router.post("/login", (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({emailId: emailId});

    if(!user){
      throw new Error("Invalid Credentials")
    }

    const isPasswordValid = await user.validatePassword(password)

    if(isPasswordValid){

      const token = await user.getJWT()

      res.cookie("token",token, {expires: new Date(Date.now() + 8 * 3600000)})

      res.json({message:"Login Successfull!!!",data: user})
    }else {
      throw new Error("Invalid Credentials")
    }
  } catch (error) {
    res
      .status(400)
      .send("Something went while fetching the user..." + +error.message);
  }
});

router.post("logout",(req,res) => {
  res
    .cookie("token", null, {expires: new Date(Date.now())})
    .send("Logout successful");
})


module.exports = authRouter;
