import express from "express";
import path from "path";
import { __filename, __dirname } from '../utils/pathUtils.js';

const router = express.Router();

router.get('/', (req, res) => { res.sendFile( path.join(__dirname, '../bot.html'))});
export default router;