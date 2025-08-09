import express from 'express';

import { addExpense, createGroup, getAllGroups, getGroupData, settleUpWithMember } from '../controllers/groupsController.js';


const GroupsRouter = express.Router();

GroupsRouter.get('/testroute', (req, res) => {
  res.send('Hello from the groups route, this is a protected route.');
});

GroupsRouter.post('/create', createGroup);

GroupsRouter.get('/getGroupData', getGroupData);

GroupsRouter.post('/addExpense',addExpense)

GroupsRouter.post('/settleUpWithMember',settleUpWithMember);

GroupsRouter.get('/getAllGroups',getAllGroups)


export default GroupsRouter;