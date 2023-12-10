import express from "express";
import dotenv from "dotenv";
import cors from 'cors'; // Import cors
import { ConnectDb } from "./Database/ConnectDB.js";
import UserRouter from "./Routes/UserRoute.js";
import MovieRouter from "./Routes/MovieRoute.js"
import cookieParser from "cookie-parser";
import multer from "multer";
import { fileURLToPath } from 'url';
import path from "path";

dotenv.config({path:"./config.env"});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connecting to database
ConnectDb();



app.use(cookieParser());
// Middleware
const corsOptions = {
    origin: ['http://localhost:3000','https://mern-web-app.azurewebsites.net'], 
    credentials: true
};

app.use(cors(corsOptions)); // Use cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// Routes
app.use("/user", UserRouter)
app.use("/movie" ,MovieRouter)

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//Listening
app.listen(process.env.PORT || 5000, ()=>{
 console.log(`Server is running on port ${process.env.PORT}`)
});

app.get("/", (req, res) => {
 res.send("<h1>Working !!!!</h1>");
});

export default app;
