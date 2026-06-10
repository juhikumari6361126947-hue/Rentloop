import { useEffect, useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Eye, ShoppingBag } from "lucide-react";
import http, { apiError } from "../api/http";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Alert from "../components/Alert";

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const { data: itemsData } = await http.get("/items", { params: { includePending: "true" } });
      setItems(itemsData.items);
      
      const { data: requestsData } = await http.get("/requests");
      setRentalRequests(requestsData.requests || []);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await http.delete(`/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      setError(apiError(err));
    }
  };

  // Calculate stats
  const totalItems = items.length;
  const availableItems = items.filter(i => i.status === 'approved').length;
  const rentedOutItems = items.filter(item => 
    rentalRequests.some(req => req.itemId === item._id && req.status === 'Accepted')
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all listings and rental inventory.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="panel p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
          <p className="text-primary-100 text-sm font-semibold uppercase tracking-wider">Total Items</p>
          <div className="flex items-center justify-between mt-4">
            <h3 className="text-4xl font-bold text-white">{totalItems}</h3>
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
              <ShoppingBag size={32} className="text-white opacity-80" />
            </div>
          </div>
        </div>
        <div className="panel p-6 bg-white border border-emerald-200">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Available</p>
          <div className="flex items-center justify-between mt-4">
            <h3 className="text-4xl font-bold text-emerald-600">{availableItems}</h3>
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Eye size={28} />
            </div>
          </div>
        </div>
        <div className="panel p-6 bg-white border border-blue-200">
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Rented Out</p>
          <div className="flex items-center justify-between mt-4">
            <h3 className="text-4xl font-bold text-blue-600">{rentedOutItems}</h3>
            <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="p-6 border-b border-light-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search items by name, category..." 
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors">
              <Filter size={18} /> Filters
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors">
              Export
            </button>
          </div>
        </div>

        {error ? <div className="p-6"><Alert type="error">{error}</Alert></div> : null}

        {loading ? (
          <div className="p-20"><Loading label="Fetching items..." /></div>
        ) : items.length === 0 ? (
          <div className="p-20">
            <EmptyState 
              icon={<ShoppingBag size={48} className="text-slate-200" />}
              title="No items found" 
              message="Get started by adding your first rental item to the marketplace."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-medium border-b border-light-border">
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Listed By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.images?.[0] || 'https://via.placeholder.com/40'} 
                          alt="" 
                          className="h-12 w-12 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate w-40">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">{item.category}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹{item.price}<span className="text-xs text-slate-400">/{item.priceType}</span></td>
                    <td className="px-6 py-4">
                      <span className={`badge ${item.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{item.owner?.name || "System"}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                        <button 
                          onClick={() => deleteItem(item._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
