import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';



const PORT = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
  origin: 'http://localhost', 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get("/api",(req,res)=>{
  res.json({ message: "Hello from the backend!" });
})


const distPath = path.join(__dirname, '../frontEnd/dist');
app.use(express.static(distPath));



app.get('/testroute', (req, res) => {

  console.log(req.cookies?.JWTAuth)
 
  res.send("Hello Guys")

})

//wildcard route
app.get(/^\/(?!api).*/,(req,res)=>{
  res.sendFile(path.join(distPath, 'index.html'));  
});




app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
