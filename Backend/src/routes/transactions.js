import { Router } from "express";
import { pool } from "../db.js";
import { authRequired } from "../middleware/auth.js";
import { toCSV, toXLSX } from "../utils/export.js";

const router = Router();

// Build WHERE clause dynamically with safe bindings
function buildFilters(query) {
  const where = [];
  const params = [];

  if (query.status) {
    where.push("status = ?");
    params.push(query.status);
  }
  if (query.deviceId) {
    where.push("device_id = ?");
    params.push(query.deviceId);
  }
  if (query.from) {
    where.push("created_at >= ?");
    params.push(query.from + " 00:00:00");
  }
  if (query.to) {
    where.push("created_at <= ?");
    params.push(query.to + " 23:59:59");
  }
  if (query.search) {
    // ✅ fix: use serial_no (but alias as serial_number in SELECT)
    where.push("(serial_no LIKE ? OR CAST(amount AS CHAR) LIKE ?)");
    params.push(`%${query.search}%`, `%${query.search}%`);
  }

  const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
  return { whereSql, params };
}

router.get("/", authRequired, async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "created_at",
    order = "DESC",
  } = req.query;
  const { whereSql, params } = buildFilters(req.query);

  const safeSort = [
    "created_at",
    "amount",
    "user_id",
    "status",
    "device_id",
    "id",
    "serial_no",
  ].includes(sort)
    ? sort
    : "created_at";
  const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const offset = (Number(page) - 1) * Number(limit);

  const [rows] = await pool.execute(
    `SELECT id, serial_no AS serial_number,user_id, amount, status, device_id, created_at
     FROM transactions
     ${whereSql}
     ORDER BY ${safeSort} ${safeOrder}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS cnt FROM transactions ${whereSql}`,
    params
  );

  res.json({ data: rows, total: countRows[0].cnt });
});

router.get("/export", authRequired, async (req, res) => {
  const { format = "csv" } = req.query;
  const { whereSql, params } = buildFilters(req.query);

  const [rows] = await pool.execute(
    `SELECT id, serial_no AS serial_number, amount, status, device_id, created_at
     FROM transactions
     ${whereSql}
     ORDER BY created_at DESC`,
    params
  );

  if (format === "excel" || format === "xlsx") {
    const buf = await toXLSX(rows);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transactions.xlsx"'
    );
    return res.send(Buffer.from(buf));
  } else {
    const csv = toCSV(rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transactions.csv"'
    );
    return res.send(csv);
  }
});

export default router;
