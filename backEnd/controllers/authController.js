import e from "express";
import admin from "../firebase-admin.js";
import users from "../models/users.js";

export const testRoute = async (req, res) => {
  res.send("Hello from the auth controller");
};

export const verifyLoginWithGoogle = async (req, res) => {
  // if there is no token in the body
  if (!req.body.token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const { token } = req.body;

  // Let's verify the token using Firebase Admin SDK
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decodedToken;

    const db_query_user = await users.findOne({ email: email });

    if (db_query_user) {
      if (db_query_user.profileCompleted) {
        // if the user is already registered and profile is completed
        res
          .status(200)
          .json({
            message: "Login successful",
            user: { email, name, picture },
            redirect: "/dashboard",
          });
      } else {
        res
          .status(200)
          .json({
            message: "Login successful but profile is incomplete",
            user: { email, name, picture },
            redirect: "/onboarding",
          });
      }
    } else {
      const newUser = new users({
        email: email.toLowerCase(),
        name: name,
        photoURL: picture,
        profileCompleted: false,
        uid: decodedToken.uid,
        isVerified: true, 
      });

      await newUser.save();

      res
        .status(200)
        .json({
          message: "User created successfully",
          user: { email, name, picture },
          redirect: "/onboarding",
        });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const verifyIfUserNameIsUnique = async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const existingUser = await users.findOne({ username: userName });
    // console.log(existingUser)
    if (existingUser) {
      return res
        .status(200)
        .json({ isUnique: false, message: "Username is already taken" });
    } else {
      return res
        .status(200)
        .json({ isUnique: true, message: "Username is available" });
    }
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const onBoardingComplete = async (req, res) => {
  const { email, name, username, dateOfBirth, upiID, photo, phoneNumber } =
    req.body;

  if (
    !email ||
    !name ||
    !username ||
    !dateOfBirth ||
    !upiID ||
    !photo ||
    !phoneNumber
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {

    console.log({
      name: name,
        username: username,
        dob: dateOfBirth,
        profileCompleted: true,
        upi: upiID,
        photoURL: photo,
        phoneNumber: phoneNumber,
    })

    const user = await users.findOneAndUpdate(
      { email: email },
      {
        name: name,
        username: username,
        dob: dateOfBirth,
        profileCompleted: true,
        upi: upiID,
        photoURL: photo,
        phoneNumber: phoneNumber,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({
        message: "Profile updated successfully",
        redirect: "/dashboard",
        user,
      });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "Internal server error", redirect: "/onboarding" });
  }
};





export const isProfileCompleted = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await users.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found", redirect: "/login" });
    }

    if (!user.isVerified) {
      console.log(user.isVerified )
      return res
        .status(403)
        .json({ error: "User is not verified", redirect: "/login" });
    }

    if (user.profileCompleted) {
      return res
        .status(200)
        .json({
          profileCompleted: true,
          message: "Profile is completed",
          redirect: "/dashboard",
        });
    } else {
      return res
        .status(200)
        .json({
          profileCompleted: false,
          message: "Profile is not completed",
          redirect: "/onboarding",
        });
    }
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};







export const normalLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if(user.uid && !user.password){
      return res.status(403).json({ error: "UseGoogleLogin" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (user.profileCompleted) {
      return res
        .status(200)
        .json({
          message: "Login successful",
          redirect: "/dashboard",
          user,
        });
    } else {
      return res
        .status(200)
        .json({
          message: "Login successful but profile is incomplete",
          redirect: "/onboarding",
          user,
        });
    }
  } catch (error) {
    console.error("Error during normal login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}