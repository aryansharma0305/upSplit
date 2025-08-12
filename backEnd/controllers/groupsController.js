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

    if (!mongoose.isValidObjectId(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Fetch group and members
    const group = await groups.findById(groupId)
      .populate("members", "name photoURL username email")
      .populate("createdBy", "name photoURL username email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(m => m._id.toString() === userId.toString());
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Recent transactions (for UI)
    const transactions = await groupTransaction.find({ groupId })
      .sort({ date: -1 })
      .limit(5)
      .populate("paidBy", "name photoURL username email")
      .populate("createdBy", "name photoURL username email");

    // All unsettled transactions (we'll use these to compute ledger + update DB)
    const allTransactions = await groupTransaction.find({ groupId, settled: false })
      .populate("paidBy", "name _id");

    // 1) Build directed ledger: ledger[A][B] = total A owes B (sum of unpaid memberShares where paidBy=B)
    const ledger = {};
    group.members.forEach(m1 => {
      const id1 = m1._id.toString();
      ledger[id1] = {};
      group.members.forEach(m2 => {
        const id2 = m2._id.toString();
        if (id1 !== id2) ledger[id1][id2] = 0;
      });
    });

    // Fill ledger from unsettled transactions
    allTransactions.forEach(txn => {
      if (!txn.paidBy || !txn.paidBy._id) return; // defensive
      const payerId = txn.paidBy._id.toString();

      // memberShares is a Mongoose Map — iterate safely
      if (txn.memberShares && typeof txn.memberShares.forEach === "function") {
        txn.memberShares.forEach((share, memberId) => {
          // only consider unpaid shares and members other than payer
          if (!share || share.paid || memberId === payerId) return;
          const amount = parseFloat(share.amount) || 0;
          ledger[memberId][payerId] = (ledger[memberId][payerId] || 0) + amount;
        });
      } else {
        // fallback if it's plain object
        Object.keys(txn.memberShares || {}).forEach(memberId => {
          const share = txn.memberShares[memberId];
          if (!share || share.paid) return;
          if (memberId === payerId) return;
          const amount = parseFloat(share.amount) || 0;
          ledger[memberId][payerId] = (ledger[memberId][payerId] || 0) + amount;
        });
      }
    });

   
    const memberIds = group.members.map(m => m._id.toString()).sort();
    for (let i = 0; i < memberIds.length; i++) {
      for (let j = i + 1; j < memberIds.length; j++) {
        const a = memberIds[i];
        const b = memberIds[j];

        const aOwesB = ledger[a][b] || 0;
        const bOwesA = ledger[b][a] || 0;
        const net = aOwesB - bOwesA;

        if (net === 0) {
         
          await groupTransaction.updateMany(
            {
              groupId,
              settled: false,
              paidBy: b,
              [`memberShares.${a}.paid`]: false
            },
            { $set: { [`memberShares.${a}.paid`]: true } }
          );

          // Mark memberShares[b].paid = true where paidBy = a
          await groupTransaction.updateMany(
            {
              groupId,
              settled: false,
              paidBy: a,
              [`memberShares.${b}.paid`]: false
            },
            { $set: { [`memberShares.${b}.paid`]: true } }
          );

          // Zero them in ledger
          ledger[a][b] = 0;
          ledger[b][a] = 0;
        } else if (net > 0) {
          // a is net owed by b (aOwesB > bOwesA => actually a owed more? careful: ledger[a][b] is A owes B)
          // normalize: ledger[a][b] = net, ledger[b][a] = 0
          ledger[a][b] = net;
          ledger[b][a] = 0;
          // Do not partially mark DB here — partial matching becomes complex. We only auto-mark when net==0.
        } else {
          // net < 0 -> b is net owed by a
          ledger[b][a] = -net;
          ledger[a][b] = 0;
        }
      }
    }

    // 3) After marking memberShares paid above, some transactions may now have all shares paid.
    // Mark those transactions as settled.
    // We'll find unsettled transactions in the group and mark settled=true if ALL memberShares.*.paid === true
    const possiblySettled = await groupTransaction.find({ groupId, settled: false });

    const toSettleIds = [];
    for (const txn of possiblySettled) {
      // txn.memberShares is a Map — check values
      let allPaid = true;
      if (txn.memberShares && typeof txn.memberShares.forEach === "function") {
        txn.memberShares.forEach((share) => {
          if (!share || !share.paid) allPaid = false;
        });
      } else {
        for (const key of Object.keys(txn.memberShares || {})) {
          const share = txn.memberShares[key];
          if (!share || !share.paid) {
            allPaid = false;
            break;
          }
        }
      }
      if (allPaid) toSettleIds.push(txn._id);
    }

    if (toSettleIds.length > 0) {
      await groupTransaction.updateMany(
        { _id: { $in: toSettleIds } },
        { $set: { settled: true } }
      );
    }

    // 4) Build final balances object for response from the (now netted) ledger
    const balances = {};
    group.members.forEach(m => {
      const id = m._id.toString();
      const owedToMe = Object.values(ledger[id] || {}).reduce((s, v) => s + (v || 0), 0);
      const iOweOthers = Object.values(ledger).reduce((sum, row) => sum + (row[id] || 0), 0);
      balances[m.name] = {
        _id: id,
        iOwe: parseFloat(iOweOthers.toFixed(2)),
        iOwed: parseFloat(owedToMe.toFixed(2)),
        net: parseFloat((owedToMe - iOweOthers).toFixed(2))
      };
    });

    // 5) Format transactions (recent ones we fetched earlier)
    const formattedTransactions = transactions.map(txn => {
      const memberShares = {};
      group.members.forEach(member => {
        let share = { amount: 0, paid: false };
        if (txn.memberShares && typeof txn.memberShares.get === "function") {
          const s = txn.memberShares.get(member._id.toString());
          if (s) share = s;
        } else if (txn.memberShares && txn.memberShares[member._id.toString()]) {
          share = txn.memberShares[member._id.toString()];
        }

        memberShares[member.name] = {
          amount: parseFloat(share.amount || 0).toFixed(2),
          paid: !!share.paid
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
        party: txn.party || group.members.map(m => m.name).join(", "),
        sector: txn.sector || "Other",
        due: txn.due ? txn.due.toISOString() : new Date().toISOString(),
        memberShares
      };
    });

    // Response payload
    const response = {
      _id: group._id,
      name: group.name,
      photoURL: group.photoURL,
      members: group.members.map(m => ({
        _id: m._id,
        name: m.name,
        profilePic: m.photoURL,
        username: m.username,
        email: m.email
      })),
      notes: group.notes || "Group for shared expenses.",
      createdBy: {
        _id: group.createdBy._id,
        name: group.createdBy.name,
        photoURL: group.createdBy.photoURL,
        username: group.createdBy.username,
        email: group.createdBy.email
      },
      transactions: formattedTransactions,
      balances
    };

    console.log("Group data fetched successfully.");
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching group data:", error);
    return res.status(500).json({ message: "Internal server error" });
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
    const group = await groups.findById(groupId);
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
        memberId: id,
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

        // Find unsettled transactions in the group where 'memberId' is the payer
        const transactions = await groupTransaction.find({
            groupId,
            paidBy: memberId,
            settled: false
        });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({
                message: "No unsettled transactions found for this member in the group."
            });
        }

        // Update each transaction's memberShares for the current user
        for (let tx of transactions) {
            if (tx.memberShares.has(userId.toString())) {
                tx.memberShares.get(userId.toString()).paid = true;

                // Check if all shares are paid, mark transaction as settled if true
                const allPaid = Array.from(tx.memberShares.values()).every(share => share.paid);
                if (allPaid) {
                    tx.settled = true;
                }

                await tx.save();
            }
        }

        res.status(200).json({
            message: "Transactions updated successfully",
            updatedTransactions: transactions
        });
    } catch (err) {
        console.error(err);
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





























































































































