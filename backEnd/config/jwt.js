import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const secret = process.env.JWT_SECRET;
export const generateAccessToken = async(id,email) => {
 
    console.log(secret)
  return jwt.sign({ id: id, email: email }, secret, {
    expiresIn: "1d",
  });
};

export const verifyToken = async(token) => {
  return jwt.verify(token, secret);
}