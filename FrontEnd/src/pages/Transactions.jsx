import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  // filters & pagination state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("DESC");

  const navigate = useNavigate();

  // fetch data from backend
  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions", {
        params: {
          page,
          limit,
          sort,
          order,
          search,
          status,
          deviceId,
          from,
          to,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true, // same as fetch's "credentials: include"
      });

      setTransactions(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/signin");
        setTransactions([]);
        setTotal(0);
        return;
      }
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    }
  };

  fetchTransactions();
}, [page, limit, sort, order, search, status, deviceId, from, to, navigate]);
  // Excel export (local)
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  // pagination
  const totalPages = Math.ceil(total / limit);

  // toggle sorting
  const handleSort = (col) => {
    if (sort === col) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSort(col);
      setOrder("ASC");
    }
  };

  // reset filters
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setDeviceId("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <div className="p-6">
      {/* Header + Export */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by Serial No or Amount"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded text-gray-700"
        >
          <option value="">-- Filter by Status --</option>
          <option value="success">✅ Success</option>
          <option value="failed">❌ Failed</option>
          <option value="pending">⏳ Pending</option>
        </select>
        <input
          type="text"
          placeholder="💻 Device ID"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-2 rounded"
          placeholder="📅 From Date"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2 rounded"
          placeholder="📅 To Date"
        />
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border p-2 rounded text-gray-700"
        >
          <option value={10}>Show 10 / page</option>
          <option value={20}>Show 20 / page</option>
          <option value={50}>Show 50 / page</option>
        </select>
        <button
          onClick={resetFilters}
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {["Serail No", "user_id", "amount", "device_id", "status", "created_at"].map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-2 text-left cursor-pointer"
                >
                  {col.toUpperCase()}{" "}
                  {sort === col ? (order === "ASC" ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-t">
                  <td className="px-4 py-2">{tx.serial_number}</td>
                  <td className="px-4 py-2">{tx.user_id}</td>
                  <td className="px-4 py-2">₹{tx.amount}</td>
                  <td className="px-4 py-2">{tx.device_id}</td>
                  <td className="px-4 py-2">{tx.status}</td>
                  <td className="px-4 py-2">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
