import { Router } from "express";
import { pool } from "../db.js";
import { authRequired } from "../middleware/auth.js";
import ExcelJS from "exceljs";

const router = Router();

// GET all transactions with filters
router.get("/", authRequired, async (req, res) => {
  try {
    const { serial_no, status, device_id, from, to } = req.query;
    let query = "SELECT * FROM transactions WHERE 1=1";
    let params = [];

    if (serial_no) {
      query += " AND serial_no LIKE ?";
      params.push(`%${serial_no}%`);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (device_id) {
      query += " AND device_id = ?";
      params.push(device_id);
    }
    if (from && to) {
      query += " AND DATE(created_at) BETWEEN ? AND ?";
      params.push(from, to);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// EXPORT to Excel
router.get("/export", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM transactions ORDER BY created_at DESC");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      { header: "Serial No", key: "serial_no", width: 15 },
      { header: "User ID", key: "user_id", width: 15 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Device ID", key: "device_id", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "created_at", width: 20 }
    ];

    rows.forEach((row) => worksheet.addRow(row));

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export Excel" });
  }
});

export default router;
