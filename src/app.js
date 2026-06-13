const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Arun",
    lastName: "Dalakoti",
    emailId: "test@gmail.com",
    password: "password",
  });

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
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
