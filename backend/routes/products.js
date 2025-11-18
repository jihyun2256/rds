import express from "express";
import { db } from "../db.js";

const router = express.Router();

// 전체 상품 조회
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
});

export default router;
