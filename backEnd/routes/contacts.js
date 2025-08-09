import express from "express";
import { discardTransaction, getTransactionsWithUser, isContact, settleUpTransaction } from "../controllers/contactsController.js";
import { addTransaction } from "../controllers/contactsController.js";
import { get } from "mongoose";



const ContactsRouter = express.Router();


ContactsRouter.get("/testroute", (req, res) => {
  res.send("Hello from the contacts route, this is a protected route");
});

ContactsRouter.get("/isContact", isContact);

ContactsRouter.post("/addTransaction", addTransaction);

ContactsRouter.get("/getTransactionWithUser", getTransactionsWithUser)

ContactsRouter.post("/settleUpTransaction", settleUpTransaction);

ContactsRouter.post("/discardtTransaction", discardTransaction);


export default ContactsRouter;