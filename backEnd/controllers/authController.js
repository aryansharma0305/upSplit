import e from "express";
import admin from "../firebase-admin.js";
import users from "../models/users.js";
import { generateAccessToken } from "../config/jwt.js";
import { verifyToken } from "../config/jwt.js";

import { scheduleEmail } from "../queue.js";

export const testRoute = async (req, res) => {
  res.send("Hello from the auth controller");
};

export const verifyLoginWithGoogle = async (req, res) => {
  if (!req.body.token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decodedToken;

    const db_query_user = await users.findOne({ email: email });

    if (db_query_user) {
      if (db_query_user.profileCompleted) {
        const token = await generateAccessToken(
          db_query_user._id,
          db_query_user.email
        );
        res
          .status(200)
          .cookie("jwt",token)          
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
    const existingUser = await users.findOne({  username: { $regex: new RegExp(`^${userName}$`, "i") } });
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
      .cookie("jwt", await generateAccessToken(user._id, user.email))
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
        .cookie("jwt", await generateAccessToken(user._id, user.email))
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










export const  handleRegister = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {

    const existingUser = await users.findOne({ email: email });

    if (existingUser) {
      if(existingUser.isVerified){
        return res.status(409).json({ error: "User already exists" });
      }

                  const htmlBody = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Email Verification</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f9fc;
                    padding: 20px;
                    color: #333;
                  }
                  .container {
                    background-color: #ffffff;
                    max-width: 500px;
                    margin: auto;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    text-align: center;
                  }
                  h1 {
                    color: #16a34a;
                    font-size: 22px;
                  }
                  p {
                    font-size: 15px;
                    line-height: 1.5;
                  }
                  a.verify-btn {
                    display: inline-block;
                    padding: 12px 20px;
                    margin-top: 20px;
                    background: linear-gradient(90deg, #16a34a, #0d9488);
                    color: white;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 8px;
                  }
                  a.verify-btn:hover {
                    background: linear-gradient(90deg, #0d9488, #16a34a);
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Verify Your Email</h1>
                  <p>Hello,</p>
                  <p>Thank you for signing up for <strong>upSplit</strong>. Please confirm your email address by clicking the button below.</p>
                  <a class="verify-btn" href="https://upsplit.aryan-sharma.xyz/verifyEmail?authToken=${existingUser.authToken}">
                    Verify Email
                  </a>
                  <p>If you did not create this account, you can safely ignore this email.</p>
                </div>
              </body>
              </html>
              `;

                  scheduleEmail(
                email,
                "Verify your email",
                htmlBody,
                1,
                Date.now() + 10
              );

      
      return res.status(409).json({ error: "User already exists" });
    }

    const length = 64;
    let result = '';
    while (result.length < length) {
      result += Math.random().toString(36).substring(2); 
    }
    result = result.substring(0, length);
    result = result+"_"+email.replace(/[^a-zA-Z0-9]/g, '_')

    


    const newUser = new users({
      email: email.toLowerCase(),
      name: name,
      password: password,
      profileCompleted: false,
      isVerified: false, 
     
      authToken: result,
    });

    await newUser.save();
 

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f9fc;
      padding: 20px;
      color: #333;
    }
    .container {
      background-color: #ffffff;
      max-width: 500px;
      margin: auto;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      text-align: center;
    }
    h1 {
      color: #16a34a;
      font-size: 22px;
    }
    p {
      font-size: 15px;
      line-height: 1.5;
    }
    a.verify-btn {
      display: inline-block;
      padding: 12px 20px;
      margin-top: 20px;
      background: linear-gradient(90deg, #16a34a, #0d9488);
      color: white;
      font-weight: bold;
      text-decoration: none;
      border-radius: 8px;
    }
    a.verify-btn:hover {
      background: linear-gradient(90deg, #0d9488, #16a34a);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verify Your Email</h1>
    <p>Hello,</p>
    <p>Thank you for signing up for <strong>upSplit</strong>. Please confirm your email address by clicking the button below.</p>
    <a class="verify-btn" href="https://upsplit.aryan-sharma.xyz/verifyEmail?authToken=${result}">
      Verify Email
    </a>
    <p>If you did not create this account, you can safely ignore this email.</p>
  </div>
</body>
</html>
`;

    scheduleEmail(
  email,
  "Verify your email",
  htmlBody,
  1,
  Date.now() + 10
);


    res.status(201).json({
      message: "User registered successfully",
      user: { email, name },
      redirect: "/onboarding",
    });
  
  } 
  catch (error) {
    console.log("=========")
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }

}






export const verifyEmailLinkForRegister = async (req, res) => { 
  const { authToken } = req.body;

  if (!authToken) {
    return res.status(400).json({ error: "Auth token is required" });
  }

  try {
    const user = await users.findOne({ authToken: authToken });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired link" });
    }

    user.isVerified = true;
    user.authToken = "";
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      redirect: "/login",
      user: {
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error("Error verifying email link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}




export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
 
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const checkIfAuthorized = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = await verifyToken(token);
    const user = await users.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User is authorized",
      user: {
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        upi: user.upi,
        username: user.username,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
      
      },
    });
  } catch (error) {
    console.error("Error checking authorization:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};