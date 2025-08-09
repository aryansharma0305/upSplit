import {verifyToken} from '../config/jwt.js';
import users from '../models/users.js';


export const authChecker= async( req, res, next) => {

    const cookie = req.cookies.jwt;
    if(!cookie){
        return res.status(401).json({ error: "Unauthorized" });
    }    
    try{
    const decoded = await verifyToken(cookie);
    const user = await users.findById(decoded.id);
    // console.log(user)
    if(!user){
        return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next()
    
    }
    catch(error){
        console.error("Token verification failed:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}