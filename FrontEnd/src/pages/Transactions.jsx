import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    serial_no: "",
    status: "",
    device_id: "",
    from: "",
    to: ""
  });
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions", { params: filters });
      setTransactions(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    fetchTransactions();
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/transactions/export", {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transactions</h2>
        <div>
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Export to Excel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        <input
          type="text"
          name="serial_no"
          placeholder="Serial No"
          value={filters.serial_no}
          onChange={handleChange}
          className="border p-2"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
        <input
          type="text"
          name="device_id"
          placeholder="Device ID"
          value={filters.device_id}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
          className="border p-2"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Serial No</th>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Device ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="p-2 border">{tx.serial_no}</td>
                <td className="p-2 border">{tx.user_id}</td>
                <td className="p-2 border">{tx.amount}</td>
                <td className="p-2 border">{tx.device_id}</td>
                <td className="p-2 border">{tx.status}</td>
                <td className="p-2 border">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-2 text-center">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
