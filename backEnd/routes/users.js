import express from "express";
import users from "../models/users.js";
import { GetUser ,UpdateUser,GetRandomUser, addContact, SearchUsers, removeContact} from "../controllers/usersController.js";
const UsersRouter = express.Router();




UsersRouter.get("/testroute", (req, res) => {
  res.send("Hello from the users route");
});


UsersRouter.get("/getUser/:q", GetUser)

UsersRouter.post("/updateUser", UpdateUser)

UsersRouter.get('/getRandomUsers', GetRandomUser)

UsersRouter.post("/addcontact",addContact)

UsersRouter.delete("/removeContact", removeContact);


UsersRouter.get('/search',SearchUsers)


export default UsersRouter;