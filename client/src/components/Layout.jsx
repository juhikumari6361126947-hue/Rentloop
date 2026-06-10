import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Boxes, LogOut, Shield, UserRound, Home, ShoppingBag, Bell, Settings, Search, Menu, X, Facebook, Twitter, Instagram, Linkedin, ArrowRight, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppChat from "./WhatsAppChat";

export default function Layout({ children }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isDashboard = location.pathname.startsWith("/admin") || location.pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <div className="flex min-h-screen bg-light-bg font-sans text-slate-800">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-dark-sidebar shadow-2xl transition-transform duration-300">
          <div className="flex h-full flex-col p-6">
            <Link to="/" className="flex items-center gap-3 mb-10 px-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
                <Boxes size={22} />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">RentLoop</span>
            </Link>

            <nav className="flex-1 space-y-2">
              <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Main Menu</p>
              
              <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
                <Home size={20} /> Home
              </NavLink>

              {user?.role === "admin" ? (
                <>
                  <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
                    <Shield size={20} /> Admin Panel
                  </NavLink>
                  <NavLink to="/admin/items" className="sidebar-link">
                    <ShoppingBag size={20} /> Products
                  </NavLink>
                </>
              ) : (
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
                  <UserRound size={20} /> My Dashboard
                </NavLink>
              )}

              <NavLink to="/notifications" className="sidebar-link">
                <Bell size={20} /> Notifications
              </NavLink>
              
              <NavLink to="/settings" className="sidebar-link">
                <Settings size={20} /> Settings
              </NavLink>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="h-10 w-10 rounded-full bg-slate-700 grid place-items-center text-white font-bold uppercase shadow-inner">
                  {user?.name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
                </div>
              </div>
              <button className="sidebar-link w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors" onClick={handleLogout}>
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col pl-64">
          <header className="sticky top-0 z-20 h-20 border-b border-light-border bg-white/80 backdrop-blur-md flex items-center justify-end px-8">
            <div className="flex items-center gap-6">
              <button className="relative text-slate-500 hover:text-primary-600 transition-colors">
                <Bell size={22} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-[10px] font-bold text-white rounded-full grid place-items-center border-2 border-white shadow-sm">3</span>
              </button>
              <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 grid place-items-center uppercase font-bold shadow-sm">
                {user?.name?.charAt(0) || <UserRound size={20} />}
              </div>
            </div>
          </header>
          <main className="p-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {children}
            </motion.div>
          </main>
        </div>

        {/* WhatsApp Chat Widget */}
        <WhatsAppChat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg font-sans flex flex-col">
      {/* Premium Navbar */}
      <header 
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-lg shadow-soft py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/30 overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Boxes size={22} className="relative z-10" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${isScrolled ? "text-slate-900" : "text-slate-900 drop-shadow-sm"}`}>
              RentLoop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={`text-sm font-semibold transition-colors hover:text-primary-600 ${isScrolled ? "text-slate-600" : "text-slate-700"}`}>
              Browse
            </NavLink>
            <a href="#categories" className={`text-sm font-semibold transition-colors hover:text-primary-600 ${isScrolled ? "text-slate-600" : "text-slate-700"}`}>
              Categories
            </a>
            <a href="#how-it-works" className={`text-sm font-semibold transition-colors hover:text-primary-600 ${isScrolled ? "text-slate-600" : "text-slate-700"}`}>
              How it Works
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative text-slate-700 hover:text-primary-600 transition-colors p-2">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-500 text-[11px] font-bold text-white rounded-full grid place-items-center border border-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {user?.role === "admin" ? (
              <NavLink to="/admin" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all">
                <Shield size={18} /> Admin Panel
              </NavLink>
            ) : isAuthenticated ? (
              <NavLink to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all">
                <UserRound size={18} /> Dashboard
              </NavLink>
            ) : null}
            
            {isAuthenticated ? (
              <button className="inline-flex items-center gap-2 rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-all" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-semibold transition-colors hover:text-primary-600 ${isScrolled ? "text-slate-700" : "text-slate-800"}`}>
                  Log in
                </Link>
                <Link to="/signup" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all">
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="flex flex-col px-6 py-6 space-y-4">
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-slate-800">Browse Items</NavLink>
                <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-slate-800">Categories</a>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-lg font-semibold text-primary-600">
                  <ShoppingCart size={20} />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
                {isAuthenticated ? (
                  <>
                    <NavLink to={user?.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-primary-600">
                      {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </NavLink>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-lg font-semibold text-red-500 text-left">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-slate-800">Log in</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-primary-600">Sign up</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Content */}
      <main className="flex-1 pt-24 pb-20">{children}</main>

      {/* WhatsApp Chat Widget */}
      <WhatsAppChat />

      {/* Modern Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/20">
                  <Boxes size={22} />
                </span>
                <span className="text-2xl font-bold tracking-tight text-white">RentLoop</span>
              </Link>
              <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                The premium marketplace to rent everyday items from people nearby. Save money, reduce waste, and experience more.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Explore</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="hover:text-primary-400 transition-colors">Browse Rentals</Link></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Trust & Safety</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
              <p className="text-sm text-slate-400 mb-4">Subscribe for the latest rentals & offers.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary-500 text-white rounded-md px-3 hover:bg-primary-600 transition-colors flex items-center justify-center">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} RentLoop Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
