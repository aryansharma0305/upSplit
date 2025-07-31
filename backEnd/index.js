import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from './firebase-admin.js'; 
import dotenv from 'dotenv';
import AuthRouter from './routes/auth.js';
import UsersRouter from './routes/users.js';
import connectDB from './config/dbConnnection.js';




dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();




app.use(cors({
  origin: 'http://localhost', 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const distPath = path.join(__dirname, '../frontEnd/dist');
app.use(express.static(distPath));

connectDB()


// ROUTERS
app.use('/api/auth', AuthRouter);
app.use('/api/users', UsersRouter);



// test route
app.get("/api",(req,res)=>{
  res.json({ message: "Hello from the backend!" });
})



// SERVE REACT APP
app.get(/^\/(?!api).*/,(req,res)=>{
  res.sendFile(path.join(distPath, 'index.html'));  
});




app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
