import { useEffect, useState } from "react";
import { MapPin, Plus, RefreshCw, Trash2 } from "lucide-react";
import http, { apiError } from "../api/http";
import Alert from "../components/Alert";
import EmptyState from "../components/EmptyState";
import ItemCard from "../components/ItemCard";
import Loading from "../components/Loading";
import RequestList from "../components/RequestList";
import LocationPicker from "../components/LocationPicker";
import { useAuth } from "../context/AuthContext";
import { getCurrentPosition } from "../utils/geo";

export default function UserDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    pickupLat: "",
    pickupLng: "",
    phone: "",
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemRes, incomingRes, outgoingRes, notificationRes] = await Promise.all([
        http.get("/items", { params: { owner: "me", includePending: "true" } }),
        http.get("/requests", { params: { type: "incoming" } }),
        http.get("/requests", { params: { type: "outgoing" } }),
        http.get("/notifications")
      ]);
      setItems(itemRes.data.items);
      setIncoming(incomingRes.data.requests);
      setOutgoing(outgoingRes.data.requests);
      setNotifications(notificationRes.data.notifications);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createItem = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      await http.post("/items", payload, { headers: { "Content-Type": "multipart/form-data" } });
      setForm({ title: "", description: "", category: "", price: "", location: "", pickupLat: "", pickupLng: "", phone: "", image: null });
      event.target.reset();
      setNotice("Item submitted for admin approval.");
      loadData();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    await http.delete(`/items/${id}`);
    loadData();
  };

  const usePickupLocation = async () => {
    setError("");
    try {
      const point = await getCurrentPosition();
      setForm((current) => ({ ...current, pickupLat: point.lat, pickupLng: point.lng }));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateRequest = async (id, status) => {
    await http.put(`/requests/${id}`, { status });
    loadData();
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="panel p-4 md:col-span-2">
          <p className="text-sm text-slate-500">Profile</p>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-sm text-slate-600">{user?.email}</p>
        </div>
        <div className="panel p-4">
          <p className="text-sm text-slate-500">Listings</p>
          <p className="text-3xl font-bold text-teal">{items.length}</p>
        </div>
        <div className="panel p-4">
          <p className="text-sm text-slate-500">Unread Alerts</p>
          <p className="text-3xl font-bold text-coral">{notifications.filter((n) => !n.read).length}</p>
        </div>
      </section>

      {error ? <Alert>{error}</Alert> : null}
      {notice ? <Alert type="success">{notice}</Alert> : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="panel h-fit space-y-4 p-5" onSubmit={createItem}>
          <h2 className="text-xl font-bold">Add New Item</h2>
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input min-h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
            <option value="" disabled>Select Category</option>
            <option value="Home Appliance">Home Appliance</option>
            <option value="Electronics">Electronics</option>
            <option value="Laptops / Computers">Laptops / Computers</option>
            <option value="Furniture">Furniture</option>
            <option value="Medical Equipment & Service">Medical Equipment & Service</option>
            <option value="Musical Instruments">Musical Instruments</option>
            <option value="Kids Utilities">Kids Utilities</option>
            <option value="Fitness & Sports Equipment">Fitness & Sports Equipment</option>
            <option value="Generators">Generators</option>
            <option value="Vending Machine">Vending Machine</option>
            <option value="Machines & Tools">Machines & Tools</option>
            <option value="Camera & Lenses">Camera & Lenses</option>
            <option value="Automobiles">Automobiles</option>
            <option value="Mobile Washrooms">Mobile Washrooms</option>
            <option value="Drones">Drones</option>
            <option value="Events">Events</option>
            <option value="Biking & Hiking Gears">Biking & Hiking Gears</option>
            <option value="Gaming Consoles">Gaming Consoles</option>
            <option value="Gardening">Gardening</option>
            <option value="Security Equipment">Security Equipment</option>
            <option value="Construction Machines & Equipment">Construction Machines & Equipment</option>
            <option value="Other">Other</option>
          </select>
          <input className="input" type="number" min="1" placeholder="Price per day in INR" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="input" placeholder="City, State" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <input className="input" type="tel" placeholder="Your phone number for customers" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="space-y-2 relative z-0">
            <label className="text-sm font-bold text-slate-700">Select Pickup Location</label>
            <LocationPicker 
              lat={form.pickupLat ? Number(form.pickupLat) : null} 
              lng={form.pickupLng ? Number(form.pickupLng) : null} 
              onChange={(lat, lng) => setForm({ ...form, pickupLat: lat, pickupLng: lng })} 
            />
            <p className="text-xs text-slate-500">Click anywhere on the map to drop a pin.</p>
            <button className="btn-secondary w-full" type="button" onClick={usePickupLocation}>
              <MapPin size={16} /> Or auto-detect my current location
            </button>
          </div>
          <input className="input" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required />
          <button className="btn-primary w-full" disabled={saving}>
            <Plus size={16} /> {saving ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Listed Items</h2>
            <button className="btn-secondary px-3 py-2" onClick={loadData}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
          {loading ? <Loading /> : null}
          {!loading && items.length === 0 ? <EmptyState title="No listings yet" message="Add an item to start earning." /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                showStatus
                actions={
                  <button className="btn-danger px-3 py-2" onClick={() => deleteItem(item._id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xl font-bold">Incoming Rental Requests</h2>
          {incoming.length ? <RequestList requests={incoming} onUpdate={updateRequest} /> : <EmptyState title="No incoming requests" message="Requests for your items will appear here." />}
        </div>
        <div>
          <h2 className="mb-3 text-xl font-bold">Your Rental Requests</h2>
          {outgoing.length ? <RequestList requests={outgoing} incoming={false} /> : <EmptyState title="No outgoing requests" message="Browse items and click Rent Now." />}
        </div>
      </section>
    </div>
  );
}
