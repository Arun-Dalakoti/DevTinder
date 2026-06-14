const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = (req, res, next) => {
    try {
        const {token} = res.cookies;

        if(!token){
            throw new Error("Invalid Token")
        }

        //todo: add secret key in env = "DEV@Tinder$7"
        const decodedObj = await jwt.verify(token, "DEV@Tinder$7");

        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
    
};

module.exports = {
  userAuth,
};
