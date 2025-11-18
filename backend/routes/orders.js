import express from "express";
import { db } from "../db.js";

const router = express.Router();

// 주문 생성
router.post("/", async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { user_id, items, total_price, payment_method } = req.body;

    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      "INSERT INTO orders(user_id, total_price, payment_method) VALUES(?,?,?)",
      [user_id, total_price, payment_method]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        "INSERT INTO order_items(order_id, product_id, quantity, price) VALUES(?,?,?,?)",
        [orderId, item.id, item.quantity, item.price]
      );

      await conn.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.id]
      );
    }

    await conn.commit();
    return res.json({ success: true, order_id: orderId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ success: false, message: "SERVER_ERROR" });
  } finally {
    conn.release();
  }
});

// 특정 유저의 주문 목록
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
});

export default router;
