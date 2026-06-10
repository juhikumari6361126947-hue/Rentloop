import { ArrowUpRight, IndianRupee, MapPin, Star, Clock, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import ItemImage from "./ItemImage";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function ItemCard({ item, showStatus = false, actions }) {
  const { addToCart } = useCart();
  // Generate random rating for visual polish
  const rating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
  const reviews = Math.floor(Math.random() * 50) + 5;

  return (
    <motion.article 
      whileHover={{ y: -8 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 hover:shadow-premium border border-slate-100"
    >
      <Link to={`/items/${item._id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <ItemImage src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {showStatus && (
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-800 shadow-sm">
              {item.status}
            </span>
          )}
        </div>

        {/* Favorite/Action */}
        <div className="absolute top-4 right-4">
          <button className="grid h-8 w-8 place-items-center rounded-full bg-white/50 backdrop-blur-md text-slate-700 opacity-0 transition-all duration-300 hover:bg-white hover:text-red-500 group-hover:opacity-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>

        {/* Bottom Gradient & Price */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-4 opacity-100">
          <span className="inline-flex items-center gap-1 rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-sm font-bold text-slate-900 shadow-lg">
            <IndianRupee size={14} className="text-primary-600" />
            {item.price}
            <span className="text-xs font-semibold text-slate-500">/ day</span>
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-500 text-white shadow-lg transition-transform duration-300 group-hover:-rotate-12 group-hover:bg-primary-600">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin size={14} className="text-primary-500" /> 
            <span className="line-clamp-1">{item.location || "City Center"}</span>
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {rating} <span className="text-slate-400 font-normal">({reviews})</span>
          </div>
        </div>
        
        <Link to={`/items/${item._id}`} className="mb-2 line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary-600">
          {item.title}
        </Link>
        
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 flex-1">
          {item.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-50 text-primary-600">
              <Clock size={12} />
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {Number.isFinite(Number(item.distanceKm)) ? `${item.distanceKm} km away` : "Available Now"}
            </span>
          </div>
          
          <button
            onClick={() => addToCart(item)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 text-primary-600 font-semibold text-sm hover:bg-primary-100 transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
          {/* Book Now button */}
          <Link to={`/checkout/${item._id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 mt-2"
          >
            Book Now
          </Link>

          {actions && (
            <div className="shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
