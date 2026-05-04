import express from "express";
import { handleRefreshToken } from "../controllers/refreshController";

const router = express.Router();

router.get("/", handleRefreshToken);

export default router;
