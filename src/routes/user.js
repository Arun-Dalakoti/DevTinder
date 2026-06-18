const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

userRouter.get("/user/connections", userAuth, (req, res) => {
  try {
    const connectionRequests = ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    req.json({
      data,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

userRouter.get("/feed", userAuth, (req, res) => {
  try {
    //User should see all the user cards except ->
    // 1)- His own card
    // 2)- his connections
    // 3)- ignored people
    // 4)- already sent connection requests.

    const loggedInUser = req.user;
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

module.exports = userRouter;
