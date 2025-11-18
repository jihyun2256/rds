import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";

const router = express.Router();

// 회원가입
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      return res.status(400).json({ success: false, message: "EMAIL_EXISTS" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users(name, email, password, phone, address) VALUES(?,?,?,?,?)",
      [name, email, hashed, phone, address]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "NOT_FOUND" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "WRONG_PASSWORD" });
    }

    // 비밀번호는 응답에서 제거
    delete user.password;

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
});

export default router;
