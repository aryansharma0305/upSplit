import express from 'express'

import { getDashboardSummary, getTransactionHistory ,sendReminderForContactTransaction} from '../controllers/transactionsController.js';



const TransactionsRouter = express.Router();



TransactionsRouter.get('/testroute', (req, res) => {  
    res.send('Hello from the transactions route, this is a protected route.');
    }
);


TransactionsRouter.get('/getTransactionHistory', getTransactionHistory);    
TransactionsRouter.get('/getDashboard', getDashboardSummary);
TransactionsRouter.post('/sendReminderForContactTransation',sendReminderForContactTransaction);

export default TransactionsRouter;