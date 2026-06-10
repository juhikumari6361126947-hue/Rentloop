import { useEffect, useState } from "react";
import { Check, Trash2, X, Users, ShoppingBag, Activity, ShieldAlert, Eye, Edit2, Search } from "lucide-react";
import http, { apiError } from "../api/http";
import Alert from "../components/Alert";
import EmptyState from "../components/EmptyState";
import ItemCard from "../components/ItemCard";
import Loading from "../components/Loading";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, itemsRes] = await Promise.all([
        http.get("/admin/stats"),
        http.get("/admin/users"),
        http.get("/items", { params: { includePending: "true" } })
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setItems(itemsRes.data.items);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    await http.put(`/items/${id}/status`, { status });
    loadData();
  };

  const deleteItem = async (id) => {
    await http.delete(`/items/${id}`);
    loadData();
  };

  const removeUser = async (id) => {
    await http.delete(`/admin/users/${id}`);
    loadData();
  };

  const statConfig = {
    totalUsers: { label: "Total Users", icon: Users, color: "bg-blue-500", text: "text-blue-500" },
    activeUsers: { label: "Active Users", icon: Activity, color: "bg-emerald-500", text: "text-emerald-500" },
    totalItems: { label: "Total Products", icon: ShoppingBag, color: "bg-orange-500", text: "text-orange-500" },
    pendingApprovals: { label: "Pending Items", icon: ShieldAlert, color: "bg-purple-500", text: "text-purple-500" }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Dashboard &gt; User Management</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">Export Data</button>
          <button className="btn-primary">+ Add User</button>
        </div>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}
      {loading && !stats ? <Loading label="Loading admin data" /> : null}

      {stats ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => {
            const config = statConfig[key] || { label: key, icon: Activity, color: "bg-slate-500", text: "text-slate-500" };
            const Icon = config.icon;
            return (
              <div key={key} className="panel p-6 flex items-center gap-5">
                <div className={`h-14 w-14 rounded-full ${config.color} bg-opacity-10 flex items-center justify-center ${config.text}`}>
                  <Icon size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{config.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
                  <p className={`text-xs mt-1 ${config.text} font-medium`}>+12% this month</p>
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      <section className="panel overflow-hidden">
        <div className="p-6 border-b border-light-border bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">System Users</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-white border border-light-border rounded-lg text-sm outline-none focus:border-primary-500" />
            </div>
            <select className="bg-white border border-light-border rounded-lg px-3 py-2 text-sm outline-none">
              <option>Select Role</option>
              <option>User</option>
              <option>Owner</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 font-medium">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined On</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border">
              {users.map((user, idx) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 grid place-items-center text-slate-600 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.phone || "No phone"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${user.isVerified ? "badge-success" : "badge-warning"}`}>
                      {user.isVerified ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{new Date(user.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary-500 transition-colors"><Eye size={18} /></button>
                      <button className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Edit2 size={18} /></button>
                      {user.role !== "admin" && (
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" onClick={() => removeUser(user._id)}><Trash2 size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-light-border flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing 1 to {users.length} of {users.length} users</p>
          <div className="flex gap-2">
            <button className="btn-secondary px-3 py-1.5 text-xs">Previous</button>
            <button className="btn-primary px-3 py-1.5 text-xs bg-primary-500">1</button>
            <button className="btn-secondary px-3 py-1.5 text-xs">Next</button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Pending Approvals</h2>
          <button className="text-sm font-semibold text-primary-600">View All</button>
        </div>
        {!loading && items.filter(i => i.status === 'pending').length === 0 ? (
          <EmptyState title="All caught up!" message="No pending items to approve." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.filter(i => i.status === 'pending').map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                showStatus
                actions={
                  <div className="flex gap-2 w-full mt-4 pt-4 border-t border-light-border">
                    <button className="btn-primary flex-1 bg-emerald-500 hover:bg-emerald-600" onClick={() => updateStatus(item._id, "approved")}>
                      <Check size={16} /> Approve
                    </button>
                    <button className="btn-secondary flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => updateStatus(item._id, "rejected")}>
                      <X size={16} /> Reject
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
