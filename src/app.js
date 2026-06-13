const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
const PORT = 3000;

app.use(express.json());

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
      .send("Something went wrong while fetching all the users...");
  }
});

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
