
import users from "../models/users.js";
import express from "express";

export const  GetUser = async(req, res) => {

    const q = req.params.q;
  console.log("Fetching user with email:", q);
  try {
     let resp = await users.findOne({ email: q })
    if (!resp) {
      resp=await users.findOne({ username: q });
      if (!resp) {
        return res.status(404).json({ error: "User not found" });
      }
    }
    console.log("User found:", resp);
    const responseData = {

      _id: resp._id,
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
}






export const UpdateUser = async (req, res) => {
  const { email, name, photoURL, dob, upi, username, phoneNumber } = req.body;
  console.log("Updating user with email:", email);
  try {
    const updatedUser = await users.findOneAndUpdate(
      { email: email },
      {
        name: name,
        photoURL: photoURL,
        dob: dob,
        upi: upi,
        username: username,
        phoneNumber: phoneNumber,
      },
      { new: true } 
    );

    if (!updatedUser) {
      console.log("User not found for update");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User updated successfully:", updatedUser);
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}





export const GetRandomUser=async (req, res) => {
    try {
        const userID=req.user._id 
        const randomUser = await users.aggregate([ { $match: { _id: { $ne: userID } } },{ $sample: { size: 7 } }]);
        if (randomUser.length === 0) {
        return res.status(404).json({ error: "No users found" });
        }
        const userContacts = await users.findById(userID).select('contacts');
        const contactsSet = new Set(userContacts.contacts.map(contact => contact.toString()));
        const responseData = randomUser.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
            username: user.username,
            alreadyAdded: contactsSet.has(user._id.toString()),
        }));
        res.status(200).json(responseData);
    } 
    catch (error) {
        console.error("Error fetching random user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}



export const addContact = async (req, res) => {
  const userIdToAdd = req.body._id;
  const requesterId = req.user._id;
  

  try {
    const userToAdd = await users.findById(userIdToAdd);
    if (!userToAdd) {
      return res.status(404).json({ error: "User to add not found" });
    }

    await users.findByIdAndUpdate(requesterId, { $addToSet: { contacts: userIdToAdd } });

    await users.findByIdAndUpdate(userIdToAdd, { $addToSet: { contacts: requesterId } });

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    console.error("Error adding contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



export const removeContact = async (req, res) => {
  const userIdToRemove = req.body._id;
  const requesterId = req.user._id;
  console.log(userIdToRemove, requesterId);
  try {
    const userToRemove = await users.findById(userIdToRemove);
    if (!userToRemove) {
      return res.status(404).json({ error: "User to remove not found" });
    }
    await users.findByIdAndUpdate(requesterId, { $pull: { contacts: userIdToRemove } });
    await users.findByIdAndUpdate(userIdToRemove, { $pull: { contacts: requesterId } });
    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    console.error("Error removing contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const SearchUsers = async (req, res) => {
  const query = req.query.q || null;
  const limit = 10;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const regex = new RegExp(query, "i");
    const userId = req.user._id;

   
    const usersFound = await users.find({
      _id: { $ne: userId },
      $or: [
        { name: regex },
        { email: regex },
        { username: regex }
      ]
    })
    .limit(50) 
    .select("name email photoURL username _id");

   
    const q = query.toLowerCase();
    const scored = usersFound.map(user => {
      const u = user.toObject();
      const name = u.name?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";
      const username = u.username?.toLowerCase() || "";

      let score = 0;
      if ([name, email, username].includes(q)) {
        score = 3; 
      } else if (
        name.startsWith(q) || email.startsWith(q) || username.startsWith(q)
      ) {
        score = 2;
      } else {
        score = 1; 
      }

      return { ...u, _score: score };
    });

    const semifinalUsers = scored
      .sort((a, b) => b._score - a._score)
      .slice(0, limit)
      .map(({ _score, ...rest }) => rest);


    const userContacts = await users.findById(userId).select('contacts');
    const contactsSet = new Set(userContacts.contacts.map(contact => contact.toString()));
    const finalUsers = semifinalUsers.map(user => ({
      ...user,
      alreadyAdded: contactsSet.has(user._id.toString()),
    }));


    res.status(200).json(finalUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
