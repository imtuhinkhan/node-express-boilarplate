import express from "express";
import dotEnv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import db from './config/database.js';
import privateRoutes from './routers/privateRoutes.js';
import publicRoutes from './routers/publicRouter.js';
import path from "path";
import { __filename, __dirname } from './utils/pathUtils.js';

const app = express();
dotEnv.config();
// Define CORS options to control cross-origin requests.
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
db();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Define the routes for API.
app.use("/api", publicRoutes);
app.use("/api/admin", privateRoutes);
app.get("/", (req, res) => {  res.sendFile( path.join(__dirname, '../bot.html'))});

//server start
const Port = process.env.PORT || 8080;
app.listen(Port, console.log("Listening to port ", Port));
  