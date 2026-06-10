import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IndianRupee, MapPin, Search, ShieldCheck, Sparkles, ArrowRight, Camera, Drill, Tent, Laptop, Tv, Sofa, Stethoscope, Music, Dumbbell, Zap, Car, Navigation, Gamepad2, Home as HomeIcon, Baby, ShoppingCart, Wrench, Droplet, Bike, Leaf, AlertCircle, Hammer, Cog } from "lucide-react";
import { motion } from "framer-motion";
import http, { apiError } from "../api/http";
import ItemCard from "../components/ItemCard";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Alert from "../components/Alert";
import { getCurrentPosition, formatCoordinate } from "../utils/geo";

const categories = [
  { name: "Home Appliance", icon: HomeIcon, color: "bg-slate-100 text-slate-700" },
  { name: "Electronics", icon: Tv, color: "bg-blue-50 text-blue-600" },
  { name: "Laptops / Computers", icon: Laptop, color: "bg-indigo-50 text-indigo-600" },
  { name: "Furniture", icon: Sofa, color: "bg-amber-50 text-amber-600" },
  { name: "Medical Equipment & Service", icon: Stethoscope, color: "bg-red-50 text-red-600" },
  { name: "Musical Instruments", icon: Music, color: "bg-pink-50 text-pink-600" },
  { name: "Kids Utilities", icon: Baby, color: "bg-rose-50 text-rose-600" },
  { name: "Fitness & Sports Equipment", icon: Dumbbell, color: "bg-orange-50 text-orange-600" },
  { name: "Generators", icon: Zap, color: "bg-yellow-50 text-yellow-600" },
  { name: "Vending Machine", icon: ShoppingCart, color: "bg-lime-50 text-lime-600" },
  { name: "Machines & Tools", icon: Wrench, color: "bg-teal-50 text-teal-600" },
  { name: "Camera & Lenses", icon: Camera, color: "bg-stone-50 text-stone-600" },
  { name: "Automobiles", icon: Car, color: "bg-cyan-50 text-cyan-600" },
  { name: "Mobile Washrooms", icon: Droplet, color: "bg-blue-100 text-blue-700" },
  { name: "Drones", icon: Navigation, color: "bg-sky-50 text-sky-600" },
  { name: "Events", icon: Sparkles, color: "bg-violet-50 text-violet-600" },
  { name: "Biking & Hiking Gears", icon: Bike, color: "bg-green-50 text-green-600" },
  { name: "Gaming Consoles", icon: Gamepad2, color: "bg-purple-50 text-purple-600" },
  { name: "Gardening", icon: Leaf, color: "bg-emerald-50 text-emerald-600" },
  { name: "Security Equipment", icon: AlertCircle, color: "bg-red-100 text-red-700" },
  { name: "Construction Machines & Equipment", icon: Hammer, color: "bg-gray-100 text-gray-700" }
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [location, setLocation] = useState("");
  const [radiusKm, setRadiusKm] = useState("5");
  const [searchPoint, setSearchPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("city"); // 'city' or 'near'
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchItems = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await http.get("/items", { params });
      setItems(data.items);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCitySearch = (event) => {
    event.preventDefault();
    setSearchPoint(null);
    fetchItems({ location, category: selectedCategory });
  };

  const handleRadiusSearch = (event) => {
    event.preventDefault();
    if (!searchPoint) {
      useMyLocation();
      return;
    }
    setLocation("");
    fetchItems({ lat: searchPoint.lat, lng: searchPoint.lng, radiusKm, category: selectedCategory });
  };

  const handleCategoryClick = (categoryName) => {
    const newCategory = selectedCategory === categoryName ? "" : categoryName;
    setSelectedCategory(newCategory);
    
    // Maintain other search params
    if (activeTab === "near" && searchPoint) {
      fetchItems({ lat: searchPoint.lat, lng: searchPoint.lng, radiusKm, category: newCategory });
    } else {
      fetchItems({ location, category: newCategory });
    }
    
    // Scroll to items
    document.getElementById("items-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  const useMyLocation = async () => {
    setError("");
    try {
      const point = await getCurrentPosition();
      setSearchPoint(point);
      fetchItems({ lat: point.lat, lng: point.lng, radiusKm });
      setActiveTab("near");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white min-h-[600px] flex flex-col justify-center shadow-premium">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="h-full w-full object-cover opacity-40 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2000&q=80"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-500/20 blur-[120px]" />
        </div>

        <div className="relative z-10 px-8 md:px-12 lg:px-20 py-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-primary-300 border border-white/10 mb-8"
          >
            <Sparkles size={16} /> Premium Rental Marketplace
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl mb-6"
          >
            Rent the everyday. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-300">Experience the extraordinary.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg text-slate-300 mb-12"
          >
            Access thousands of high-quality items from people in your neighborhood. Why buy when you can RentLoop?
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl"
          >
            <div className="flex gap-2 p-2 mb-2">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'city' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10'}`}
                onClick={() => setActiveTab('city')}
              >
                Search City
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'near' ? 'bg-white text-slate-900 shadow' : 'text-white hover:bg-white/10'}`}
                onClick={useMyLocation}
              >
                <MapPin size={16} /> Near Me
              </button>
            </div>

            {activeTab === 'city' ? (
              <form onSubmit={handleCitySearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 bg-white rounded-xl overflow-hidden flex items-center px-4">
                  <Search className="text-slate-400 shrink-0" size={20} />
                  <input
                    className="w-full bg-transparent border-none outline-none py-4 pl-3 text-slate-900 placeholder-slate-500 font-medium"
                    placeholder="Enter city or state..."
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                  />
                </div>
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold transition-colors whitespace-nowrap" type="submit">
                  Find Items
                </button>
              </form>
            ) : (
              <form onSubmit={handleRadiusSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 bg-white rounded-xl overflow-hidden flex items-center px-4">
                  <MapPin className="text-primary-500 shrink-0" size={20} />
                  <div className="flex-1 py-4 pl-3 text-slate-900 font-medium truncate">
                    {searchPoint ? `Lat: ${formatCoordinate(searchPoint.lat)}, Lng: ${formatCoordinate(searchPoint.lng)}` : "Location pending..."}
                  </div>
                  <select 
                    className="bg-slate-100 border-none outline-none text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm ml-2" 
                    value={radiusKm} 
                    onChange={(event) => setRadiusKm(event.target.value)}
                  >
                    <option value="1">1 km</option>
                    <option value="2">2 km</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                  </select>
                </div>
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold transition-colors whitespace-nowrap" type="submit">
                  Search Radius
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Explore Categories</h2>
            <p className="mt-2 text-slate-600">Find exactly what you need for your next project or adventure.</p>
          </div>
          <Link to="/" className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <motion.div 
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`cursor-pointer group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  isSelected 
                    ? "border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-500/20" 
                    : "border-slate-200 bg-white shadow-sm hover:border-primary-300 hover:shadow-md"
                }`}
              >
                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:-translate-y-1 ${cat.color} ${isSelected ? "ring-2 ring-primary-200" : ""}`}>
                  <Icon size={28} />
                </div>
                <h3 className={`font-bold text-center text-sm ${isSelected ? "text-primary-700" : "text-slate-800"}`}>
                  {cat.name}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Main Items Section */}
      <section id="items-grid">
        {error ? <Alert>{error}</Alert> : null}
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {selectedCategory ? `${selectedCategory} near you` : (activeTab === 'near' && searchPoint ? "Rentals near you" : "Trending rentals")}
            </h2>
            <p className="mt-2 text-slate-600">
              Discover popular items available to rent today.
            </p>
          </div>
          <div className="inline-flex items-center rounded-lg bg-slate-100 p-1 border border-slate-200">
            <span className="px-4 py-1.5 text-sm font-semibold text-slate-800 bg-white rounded-md shadow-sm">
              All Items ({items.length})
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-12">
            <Loading label="Curating the best rentals for you..." />
          </div>
        ) : null}

        {!loading && items.length === 0 ? (
          <div className="py-12">
            <EmptyState title="No items found" message="Try adjusting your search criteria or checking another location." />
          </div>
        ) : null}

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {items.map((item) => (
            <motion.div
              key={item._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ItemCard
                item={item}
                actions={
                  <Link className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800" to={`/items/${item._id}`}>
                    Book Now
                  </Link>
                }
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 mt-12 rounded-[2rem] bg-slate-50 border border-slate-200 px-8 lg:px-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-12">Why Choose RentLoop?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Users</h3>
            <p className="text-slate-600 leading-relaxed">Every user on our platform is verified for safety, ensuring secure and reliable transactions every time.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Hyper-Local</h3>
            <p className="text-slate-600 leading-relaxed">Find exactly what you need just blocks away. Save on shipping and reduce your carbon footprint.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-6">
              <IndianRupee size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Save Money</h3>
            <p className="text-slate-600 leading-relaxed">Rent high-quality items for a fraction of the cost of buying. It's smart, economical, and convenient.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-primary-600 text-white p-12 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
        
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Have items gathering dust?</h2>
          <p className="text-primary-100 text-lg">List them on RentLoop and start earning money today. It's free to list and fully protected.</p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link to="/dashboard" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary-600 shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all hover:-translate-y-1">
            List Your Product
          </Link>
        </div>
      </section>
    </div>
  );
}
