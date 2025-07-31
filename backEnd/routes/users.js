import express from "express";
import users from "../models/users.js";
const UsersRouter = express.Router();

UsersRouter.get("/testroute", (req, res) => {
  res.send("Hello from the users route");
});




UsersRouter.get("/getUser/:email", async(req, res) => {
  const email = req.params.email;
  console.log("Fetching user with email:", email);
  try {
     const resp = await users.findOne({ email: email })
    if (!resp) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User found:", resp);
    const responseData = {
      name: resp.name,
      email: resp.email,
      photoURL: resp.photoURL,
      dob: resp.dob,
      upi: resp.upi,
      username: resp.username,
      phoneNumber: resp.phoneNumber,
    };
    res.status(200).json(responseData); 



  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error2" });
  }
})


export default UsersRouter;