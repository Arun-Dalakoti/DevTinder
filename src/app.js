const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser())

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.email });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong while fetching user details...");
  }
});

app.delete("/user", (req, res) => {
  try {
    const userId = req.body.userId;

    const user = User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong while deleting the user...");
  }
});

app.patch("/user:userId", async (req, res) => {
  const allowedUpdates = ["photoUrl", "about", "gender", "age", "skills"];
  try {
    const body = req.body;
    const userId = req.params?.userId;

    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k),
    );

    if (!isUpdateAllowed) {
      res.status(400).send("Update is not allowed.");
    }

    if (body?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, body, {
      returnDocument: "before",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong while updating the user...");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res
      .status(400)
      .send(
        "Something went wrong while fetching all the users..." + error.message,
      );
  }
});

app.post("/login", (req, res) => {
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

      res.send("Login Successfull!!!")
    }else {
      throw new Error("Invalid Credentials")
    }
  } catch (error) {
    res
      .status(400)
      .send("Something went while fetching the user..." + +error.message);
  }
});

app.get("/profile", userAuth ,(req,res) => {
  try {
    const user = req.user;
    
    res.send(user);
  } catch (error) {
    res.status(400).send("Error getting the user: " + error.message);
  }
  
})

app.post("/signup", async (req, res) => {
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

app.get("/", (req, res) => {
  res.send("hello");
});

connectDB()
  .then(() => {
    console.log("DB connected!!!!");
    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}`);
    });
  })
  .catch(() => console.log("DB not connected"));
