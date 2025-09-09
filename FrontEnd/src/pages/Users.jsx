import { useEffect, useState } from "react";
import { getUsers } from "@/services/users";
import Card from "@/components/ui/Card";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("DESC");

  // Fetch all users once
  useEffect(() => {
    getUsers()
      .then((res) => {
        const data = res.data || res.data.data || [];
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((e) => console.error(e));
  }, []);

  // Apply filters (search + sort + pagination) on the client
  useEffect(() => {
    let result = [...users];

    // 🔍 Search filter
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter(
        (u) =>
          u.email?.toLowerCase().includes(lower) ||
          u.role?.toLowerCase().includes(lower) ||
          String(u.id).includes(lower)
      );
    }

    // ↕️ Sorting
    result.sort((a, b) => {
      const valA = a[sort];
      const valB = b[sort];
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === "string") {
        return order === "ASC"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return order === "ASC" ? valA - valB : valB - valA;
    });

    // 📑 Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    setFiltered(result.slice(start, end));
  }, [users, q, page, sort, order]);

  const totalPages = Math.ceil(
    (q ? users.filter((u) => u.email?.toLowerCase().includes(q.toLowerCase())).length : users.length) /
      limit
  );

  const handleSort = (col) => {
    if (sort === col) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSort(col);
      setOrder("ASC");
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <input
          className="border px-3 py-2 rounded-md w-64"
          placeholder="Search users..."
          value={q}
          onChange={(e) => {
            setPage(1); // reset to first page when searching
            setQ(e.target.value);
          }}
        />
      </div>

      {/* Users Table */}
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID {sort === "id" ? (order === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {sort === "email" ? (order === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role {sort === "role" ? (order === "ASC" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Created{" "}
                {sort === "created_at" ? (order === "ASC" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{u.id}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
