import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, IndianRupee, MapPin, Phone, MapPinIcon, Send, ShieldCheck } from "lucide-react";
import http, { apiError } from "../api/http";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import ItemImage from "../components/ItemImage";
import LocationMap from "../components/LocationMap";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [item, setItem] = useState(null);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await http.get(`/items/${id}`);
        setItem(data.item);
      } catch (err) {
        setError(apiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const totalPrice = item ? Number(item.price) * Number(duration) : 0;

  const handleRentNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/items/${id}` } });
      return;
    }
    navigate(`/checkout/${id}?days=${duration}`);
  };

  if (loading) return <Loading label="Loading item details" />;
  if (error && !item) return <Alert>{error}</Alert>;

  const isOwner = item.owner?._id === user?.id;
  const pickupPoint = { lat: item.pickupLat, lng: item.pickupLng, label: item.location };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <ItemImage src={item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" />
        </div>
        <LocationMap pickup={pickupPoint} delivery={null} />
      </div>
      <section className="h-fit space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-normal">{item.title}</h1>
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold capitalize text-teal">
              {item.status}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1 text-slate-600">
            <MapPin size={17} className="text-teal" /> {item.location}
          </p>
        </div>
        <p className="text-slate-700">{item.description}</p>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center text-3xl font-bold text-teal">
            <IndianRupee size={26} /> {item.price}
            <span className="ml-2 text-sm font-medium text-slate-500">per day</span>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={16} className="text-teal" /> Verified listing
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-coral" /> Request anytime
            </span>
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Item Owner</p>
            <p className="font-semibold text-ink text-lg">{item.owner?.name}</p>
          </div>
          {(item.phone || item.owner?.phone) && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={16} className="text-teal" />
              <span>{item.phone || item.owner?.phone}</span>
            </div>
          )}
          {item.owner?.address && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPinIcon size={16} className="text-teal" />
              <span>{item.owner.address}</span>
            </div>
          )}
        </div>
        {notice ? <Alert type="success">{notice}</Alert> : null}
        {error ? <Alert>{error}</Alert> : null}
        
        {isAuthenticated && user?.role === "user" && !isOwner ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                  Rental Duration
                </label>
                <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-2">
                  <button
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-semibold text-slate-900">{duration} day{duration !== 1 ? "s" : ""}</span>
                  <button
                    onClick={() => setDuration(duration + 1)}
                    className="px-3 py-1 text-slate-600 hover:text-slate-900"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="rounded-md bg-teal-50 p-3 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Total Price</p>
                  <p className="text-2xl font-bold text-teal">₹{totalPrice}</p>
                  <p className="text-xs text-slate-600">({item?.price}/day × {duration} days)</p>
                </div>
              </div>
            </div>
            
            <button className="btn-primary w-full" onClick={handleRentNow}>
              <Send size={16} /> Rent Now - Proceed to Checkout
            </button>
          </div>
        ) : null}
        
        {!isAuthenticated ? (
          <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
            <a href="/login" className="text-teal font-semibold hover:underline">Login</a> to send a rental request.
          </p>
        ) : null}
      </section>
    </div>
  );
}
