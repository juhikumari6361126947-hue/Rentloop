import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, IndianRupee, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { cartItems, removeFromCart, updateDays, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      alert(`Checkout request for ${cartItems.length} item(s) - Total: ₹${totalPrice}`);
      clearCart();
      setIsCheckingOut(false);
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Start by adding items to your cart"
          action={
            <Link to="/" className="btn-primary">
              Browse Items
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-4 transition-colors">
            <ArrowLeft size={20} /> Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-500 mt-2">{cartItems.length} item(s) in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="panel p-6 flex gap-6 hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-primary-500" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee size={14} className="text-primary-500" />
                      {item.price}/day
                    </span>
                  </div>

                  {/* Days selector */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-2">
                      <button
                        onClick={() => updateDays(item._id, item.days - 1)}
                        disabled={item.days <= 1}
                        className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold text-slate-900">{item.days}</span>
                      <button
                        onClick={() => updateDays(item._id, item.days + 1)}
                        className="p-1 text-slate-600 hover:text-slate-900"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">
                      <Calendar size={14} className="inline mr-1" />
                      {item.days} {item.days === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end justify-between">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{item.price * item.days}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-3 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="panel p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>

              <div className="space-y-3 border-t border-b border-slate-200 py-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Platform Fee:</span>
                  <span className="font-semibold text-slate-900">₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Taxes:</span>
                  <span className="font-semibold text-slate-900">₹0</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total:</span>
                <span className="text-3xl font-bold text-primary-600">₹{totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </button>

              <button
                onClick={() => removeFromCart(cartItems[0]._id)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Continue Shopping
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-800">
                  <span className="font-bold">💡 Tip:</span> Items are held in your cart for 24 hours. Complete checkout before they expire!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
