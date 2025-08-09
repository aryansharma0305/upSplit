import groups from "../models/groups.js";
import mongoose from 'mongoose';
import groupTransaction from "../models/groupTransaction.js";
import users from "../models/users.js";

export const createGroup = async (req, res) => {
  try {
    const { name, photoURL, members } = req.body;
    const createdBy = req.user._id;

    // Validate input
    if (!name || !createdBy) {
      return res.status(400).json({ message: "Name and creator are required." });
    }

    // Validate member IDs
    const memberIds = members || [];
    for (const id of memberIds) {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: `Invalid member ID: ${id}` });
      }
      const user = await users.findById(id);
      if (!user) {
        return res.status(400).json({ message: `users not found: ${id}` });
      }
    }

    // Create new group
    const newGroup = new groups({
      name,
      photoURL,
      members: [createdBy, ...memberIds],
      createdBy,
    });

    await newGroup.save();
    const populatedGroup = await groups.findById(newGroup._id)
      .populate("members", "name photoURL username email")
      .populate("createdBy", "name photoURL username email");

    res.status(201).json({ message: "Group created successfully", group: populatedGroup });
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

























export const getGroupData = async (req, res) => {
  try {
    const { q: groupId } = req.query;
    const userId = req.user._id;

    // Validate groupId
    if (!mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Fetch group with populated members and createdBy
    const group = await groups.findById(groupId)
      .populate("members", "name photoURL username email")
      .populate("createdBy", "name photoURL username email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify user is a member
    const isMember = group.members.some((member) => member._id.toString() === userId.toString());
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Fetch the 5 most recent transactions
    const transactions = await groupTransaction.find({ groupId })
      .sort({ date: -1 })
      .limit(5)
      .populate("paidBy", "name photoURL username email")
      .populate("createdBy", "name photoURL username email");

    // Calculate member summaries
    const allTransactions = await groupTransaction.find({ groupId, settled: false })
      .populate("paidBy", "name");

    const balances = {};
    group.members.forEach((member) => {
      if (member.name) {
        balances[member.name] = {
          _id: member._id.toString(),
          iOwe: 0,
          iOwed: 0,
          net: 0,
        };
      }
    });

    allTransactions.forEach((txn) => {
      if (!txn.memberShares || !txn.paidBy?.name) {
        console.warn(`Skipping transaction ${txn._id} due to missing memberShares or paidBy`);
        return;
      }

      group.members.forEach((member) => {
        const memberName = member.name;
        const memberId = member._id.toString();
        const share = txn.memberShares.get(memberId) || { amount: 0, paid: false };
        if (typeof share.amount === "undefined" || typeof share.paid === "undefined") {
          console.warn(`Missing or invalid share for ${memberName} in transaction ${txn._id}`);
          return;
        }

        const shareAmount = parseFloat(share.amount) || 0;
        if (txn.paidBy.name === memberName) {
          balances[memberName].iOwed += parseFloat(txn.amount) || 0;
        }
        if (!share.paid && memberName !== txn.paidBy.name) {
          balances[memberName].iOwe += shareAmount;
        }
      });
    });

    // Calculate net balances
    Object.keys(balances).forEach((memberName) => {
      balances[memberName].net = balances[memberName].iOwed - balances[memberName].iOwe;
    });

    // Format transactions for frontend
    const formattedTransactions = transactions.map((txn) => {
      const memberShares = {};
      group.members.forEach((member) => {
        const share = txn.memberShares.get(member._id.toString()) || { amount: 0, paid: false };
        memberShares[member.name] = {
          amount: parseFloat(share.amount || 0).toFixed(2),
          paid: share.paid,
        };
      });

      return {
        id: txn._id.toString(),
        description: txn.title || "Untitled",
        date: txn.date ? txn.date.toISOString() : new Date().toISOString(),
        amount: parseFloat(txn.amount || 0).toFixed(2),
        paidBy: txn.paidBy?.name || "Unknown",
        split: txn.split || "absolute",
        settled: txn.settled || false,
        direction: txn.direction || "To Pay",
        party: txn.party || group.members.map((m) => m.name).join(", "),
        sector: txn.sector || "Other",
        due: txn.due ? txn.due.toISOString() : new Date().toISOString(),
        memberShares,
      };
    });

    // Prepare response
    const response = {
      _id: group._id,
      name: group.name,
      photoURL: group.photoURL,
      members: group.members.map((member) => ({
        _id: member._id,
        name: member.name,
        profilePic: member.photoURL,
        username: member.username,
        email: member.email,
      })),
      notes: group.notes || "Group for shared expenses.",
      createdBy: {
        _id: group.createdBy._id,
        name: group.createdBy.name,
        photoURL: group.createdBy.photoURL,
        username: group.createdBy.username,
        email: group.createdBy.email,
      },
      transactions: formattedTransactions,
      balances,
    };

    console.log("Group data fetched successfully:", JSON.stringify(response, null, 2));
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching group data:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};















export const addExpense = async (req, res) => {
  try {
    const { groupId, title, amount, description, split, paidBy, sector, due, memberShares, direction, party } = req.body;
    const userId = req.user._id;

    console.log("Received addExpense payload:", JSON.stringify(req.body, null, 2));

    // Validate groupId
    if (!mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Check if group exists
    const group = await group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify user is a member of the group
    if (!group.members.includes(userId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Validate paidBy is a valid ObjectId and user exists
    if (!mongoose.isValidObjectId(paidBy)) {
      return res.status(400).json({ message: "Invalid paidBy ID" });
    }
    const paidByUser = await users.findById(paidBy);
    if (!paidByUser) {
      return res.status(400).json({ message: "Payer not found" });
    }

    // Validate memberShares keys are valid ObjectIds and group members
    const memberIds = Object.keys(memberShares);
    for (const id of memberIds) {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: `Invalid member ID: ${id}` });
      }
      if (!group.members.includes(id)) {
        return res.status(400).json({ message: `Member ${id} is not in the group` });
      }
    }

    // Validate split type and shares
    const totalShare = Object.values(memberShares).reduce((sum, share) => sum + parseFloat(share.amount || 0), 0);
    if (split === "percentage" && Math.abs(totalShare - 100) > 0.01) {
      return res.status(400).json({ message: "Total percentages must equal 100%" });
    }
    if (split === "absolute" && Math.abs(totalShare - parseFloat(amount)) > 1) {
      return res.status(400).json({ message: "Total shares must be within ₹1 of the amount" });
    }

    // Ensure memberShares amounts are valid numbers
    const validatedMemberShares = new Map();
    memberIds.forEach((id) => {
      const share = memberShares[id];
      validatedMemberShares.set(id, {
        amount: parseFloat(share.amount) || 0,
        paid: share.paid || false,
      });
    });

    const newTransaction = new groupTransaction({
      groupId,
      title,
      amount: parseFloat(amount),
      description,
      split,
      paidBy,
      sector,
      due,
      memberShares: validatedMemberShares,
      date: new Date(),
      direction,
      party,
      createdBy: userId,
    });

    // Save the transaction to MongoDB
    await newTransaction.save();

    // Populate paidBy and createdBy for response
    const populatedTransaction = await groupTransaction.findById(newTransaction._id)
      .populate("paidBy", "name photoURL username email")
      .populate("createdBy", "name photoURL username email");

    // Format response to match frontend expectations
    const formattedTransaction = {
      id: populatedTransaction._id.toString(),
      description: populatedTransaction.title || "Untitled",
      date: populatedTransaction.date ? populatedTransaction.date.toISOString() : new Date().toISOString(),
      amount: parseFloat(populatedTransaction.amount || 0).toFixed(2),
      paidBy: populatedTransaction.paidBy?.name || "Unknown",
      split: populatedTransaction.split || "absolute",
      settled: populatedTransaction.settled || false,
      direction: populatedTransaction.direction || "To Pay",
      party: populatedTransaction.party || group.members.map((m) => m.name).join(", "),
      sector: populatedTransaction.sector || "Other",
      due: populatedTransaction.due ? populatedTransaction.due.toISOString() : new Date().toISOString(),
      memberShares: {},
    };

    group.members.forEach((member) => {
      const share = populatedTransaction.memberShares.get(member._id.toString()) || { amount: 0, paid: false };
      formattedTransaction.memberShares[member.name] = {
        amount: parseFloat(share.amount || 0).toFixed(2),
        paid: share.paid,
      };
    });

    console.log("Transaction saved and formatted:", JSON.stringify(formattedTransaction, null, 2));
    res.status(201).json(formattedTransaction);
  } catch (error) {
    console.error("Error adding expense:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};











































































export const settleUpWithMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const userId = req.user._id;
    console.log("Received settleUpWithMember payload:", JSON.stringify(req.body, null, 2));
    // Validate groupId
    if (!mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }
    // Check if group exists
    const group = await group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group not found" });
        }
    // Verify user is a member of the group
    if (!group.members.includes(userId)) {
        return res.status(403).json({ message: "You are not a member of this group" });
    }
    // Validate memberId
    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ message: "Invalid member ID" });
    }
    // Check if member is part of the group
    if (!group.members.includes(memberId)) {
        return res.status(404).json({ message: "Member not found in this group" });
        }   
    // Find all unsettled transactions for the group
    const unsettledTransactions = await groupTransaction.find({
        groupId,
        settled: false,
        "memberShares": { $exists: true, $ne: null }
    }).populate("paidBy", "name photoURL username email");
    if (!unsettledTransactions || unsettledTransactions.length === 0) {
      return res.status(404).json({ message: "No unsettled transactions found for this group" });
    }
    // Calculate total amount owed by the member
    let totalOwed = 0;
    unsettledTransactions.forEach((txn) => {
        const memberShare = txn.memberShares.get(memberId);
        if (memberShare && !memberShare.paid) {
            totalOwed += parseFloat(memberShare.amount || 0);
        }
    });
    if (totalOwed <= 0) {
        return res.status(400).json({ message: "Member has no outstanding dues" });
        }
    // Settle up the member by marking their shares as paid
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        for (const txn of unsettledTransactions) {
            const memberShare = txn.memberShares.get(memberId);
            if (memberShare && !memberShare.paid) {
            memberShare.paid = true;
            await txn.save({ session });
            }
        }
        // Create a new transaction to record the settlement
        const settlementTransaction = new groupTransaction({
            groupId,
            title: `Settlement with ${memberId}`,
            amount: totalOwed,
            description: `Settlement for dues with member ${memberId}`,
            split: "absolute",
            paidBy: userId,
            sector: "Settlement",
            due: new Date(),
            memberShares: new Map([[memberId, { amount: totalOwed, paid: true }]]),
            date: new Date(),
            settled: true,
            direction: "To Receive",
            party: group.members.map((m) => m.name).join(", "),
            createdBy: userId,
        });
        await settlementTransaction.save({ session });
        await session.commitTransaction();
        console.log("Member settled successfully:", memberId);
        res.status(200).json({ message: "Member settled successfully", totalOwed });
        }
    catch (error) {
        await session.abortTransaction();
        console.error("Error settling member:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
    finally {
        session.endSession();
    }
  } catch (error) {
    console.error("Error settling up with member:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }

};






























































export const getAllGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all group where the user is a member
    const group = await groups.find({ members: userId })
      .populate("members", "name photoURL username email")
      .populate("createdBy", "name photoURL username email");

    if (!group || group.length === 0) {
      return res.status(200).json([]);
    }

    // Calculate balances for each group
    const groupData = await Promise.all(
      group.map(async (group) => {
        // Fetch unsettled transactions for the group
        const allTransactions = await groupTransaction.find({ groupId: group._id, settled: false })
          .populate("paidBy", "name");

        const balances = {};
        group.members.forEach((member) => {
          if (member.name) {
            balances[member.name] = {
              _id: member._id.toString(),
              iOwe: 0,
              iOwed: 0,
              net: 0,
            };
          }
        });

        allTransactions.forEach((txn) => {
          if (!txn.memberShares || !txn.paidBy?.name) {
            console.warn(`Skipping transaction ${txn._id} due to missing memberShares or paidBy`);
            return;
          }

          group.members.forEach((member) => {
            const memberName = member.name;
            const memberId = member._id.toString();
            const share = txn.memberShares.get(memberId) || { amount: 0, paid: false };
            if (typeof share.amount === "undefined" || typeof share.paid === "undefined") {
              console.warn(`Missing or invalid share for ${memberName} in transaction ${txn._id}`);
              return;
            }

            const shareAmount = parseFloat(share.amount) || 0;
            if (txn.paidBy.name === memberName) {
              balances[memberName].iOwed += parseFloat(txn.amount) || 0;
            }
            if (!share.paid && memberName !== txn.paidBy.name) {
              balances[memberName].iOwe += shareAmount;
            }
          });
        });

        // Calculate net balances
        Object.keys(balances).forEach((memberName) => {
          balances[memberName].net = balances[memberName].iOwed - balances[memberName].iOwe;
        });

        // Calculate user's owe and toReceive
        const userBalance = balances[group.members.find((m) => m._id.toString() === userId.toString())?.name] || {
          iOwe: 0,
          iOwed: 0,
          net: 0,
        };

        return {
          id: group._id.toString(),
          name: group.name,
          members: group.members.map((m) => m.name),
          created: group.createdAt ? group.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          notes: group.notes || "Group for shared expenses",
          profilePic: group.photoURL || "https://randomuser.me/api/portraits/lego/3.jpg",
          isOwner: group.createdBy._id.toString() === userId.toString(),
          owe: userBalance.iOwe,
          toReceive: userBalance.iOwed,
          balances, // Include full balances for SettleUPDialog
        };
      })
    );

    console.log("All group fetched successfully:", JSON.stringify(groupData, null, 2));
    res.status(200).json(groupData);
  } catch (error) {
    console.error("Error fetching all group:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

















export default {
  createGroup,
  getGroupData,
  addExpense,
  settleUpWithMember,
};