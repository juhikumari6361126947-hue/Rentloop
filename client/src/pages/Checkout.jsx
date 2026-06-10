import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { MapPin, Phone, IndianRupee, ArrowLeft, Check, AlertCircle, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import http, { apiError } from "../api/http";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import LocationMap from "../components/LocationMap";
import { getCurrentPosition } from "../utils/geo";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // Form state
  const [duration, setDuration] = useState(parseInt(searchParams.get("days")) || 1);
  const [phone, setPhone] = useState(user?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryLat, setDeliveryLat] = useState("");
  const [deliveryLng, setDeliveryLng] = useState("");
  const [message, setMessage] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

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
  }, [id, isAuthenticated, navigate]);

  const totalPrice = item ? Number(item.price) * Number(duration) : 0;

  const useCurrentLocation = async () => {
    try {
      const point = await getCurrentPosition();
      setDeliveryLat(point.lat);
      setDeliveryLng(point.lng);
      setDeliveryAddress("Current Location (Coordinates saved)");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    // Validation
    if (!deliveryAddress.trim()) {
      setError("Please enter delivery address");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept terms and conditions");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Simulate payment processing
      

      // Create rental request
      await http.post("/requests", {
        itemId: id,
        message,
        deliveryLocation: deliveryAddress,
        deliveryLat: deliveryLat || null,
        deliveryLng: deliveryLng || null,
        requesterPhone: phone,
        duration,

        totalPrice
      });

      // Success - redirect to dashboard
      navigate("/dashboard", {
        state: { message: `Rental request submitted! Total: ₹${totalPrice}` }
      });
    } catch (err) {
      setError(apiError(err));
      setProcessing(false);
    }
  };

  if (loading) return <Loading label="Loading item details" />;
  if (!item) return <Alert type="error">{error || "Item not found"}</Alert>;

  const pickupPoint = { lat: item.pickupLat, lng: item.pickupLng, label: item.location };
  const deliveryPoint =
    deliveryLat && deliveryLng
      ? { lat: Number(deliveryLat), lng: Number(deliveryLng), label: deliveryAddress }
      : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <Link to={`/items/${id}`} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6 transition-colors">
          <ArrowLeft size={20} /> Back to Item
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 space-y-6">
            {error && <Alert type="error">{error}</Alert>}

            {/* Delivery Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel p-6 space-y-4"
            >
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={24} className="text-primary-600" />
                Delivery Address
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="input min-h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={deliveryLat}
                      onChange={(e) => setDeliveryLat(e.target.value)}
                      placeholder="Delivery latitude"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={deliveryLng}
                      onChange={(e) => setDeliveryLng(e.target.value)}
                      placeholder="Delivery longitude"
                      className="input"
                    />
                  </div>
                </div>

                <button
                  onClick={useCurrentLocation}
                  className="w-full px-4 py-2 rounded-lg border border-primary-300 bg-primary-50 text-primary-600 font-semibold hover:bg-primary-100 transition-colors"
                >
                  <MapPin size={16} className="inline mr-2" />
                  Use Current Location
                </button>
              </div>
            </motion.div>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="panel p-6 space-y-4"
            >
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Phone size={24} className="text-primary-600" />
                Contact Information
              </h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your mobile number"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message to Owner (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a note for the owner..."
                  className="input min-h-20"
                ></textarea>
              </div>
            
</motion.div>
            {/* Terms */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
              <label htmlFor="terms" className="flex-1 text-sm text-slate-700 cursor-pointer">
                <span className="font-semibold">I agree to the</span>
                <Link to="/terms" className="text-primary-600 hover:underline mx-1">terms and conditions</Link>
                <span>and rental policies</span>
              </label>
            </motion.div>
          </div>

          {/* Right Side - Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="panel p-6 sticky top-24 space-y-6">
              {/* Item Card */}
              <div className="space-y-3">
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
                <div>
                  <p className="text-sm text-slate-600">{item.category}</p>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                </div>
              </div>

              {/* Rental Details */}
              <div className="space-y-3 border-t border-b border-slate-200 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Price per day:</span>
                  <span className="font-semibold">₹{item.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Duration:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDuration(Math.max(1, duration - 1))}
                      className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{duration}</span>
                    <button
                      onClick={() => setDuration(duration + 1)}
                      className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
              </div>

              {/* Total */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xl">
                  <span className="font-bold text-slate-900">Total Amount:</span>
                  <span className="text-3xl font-bold text-primary-600">₹{totalPrice}</span>
                </div>

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 text-sm text-amber-800">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <p>Payment will be processed upon confirmation. Owner will review and accept/reject your request.</p>
                </div>

                {/* CTA */}
                <button
                  onClick={handleCheckout}
                  disabled={processing || !acceptTerms}
                  className="w-full btn-primary py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {processing ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} className="inline mr-2" />
                        Confirm Booking
                      </>
                    )}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
