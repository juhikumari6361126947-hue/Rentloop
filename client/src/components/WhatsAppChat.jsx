import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = "+918709851832"; // Replace with your WhatsApp number (country code + number, no +)
  const whatsappMessage = encodeURIComponent("Hi! I'd like to inquire about your rental services.");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      {/* WhatsApp Chat Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-40"
      >
        {/* Chat Bubble */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-lg shadow-green-500/40 flex items-center justify-center text-white hover:shadow-xl transition-all"
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <MessageCircle size={28} />
          )}
        </motion.button>

        {/* Chat Box */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-24 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-none"
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6">
            <h3 className="text-xl font-bold mb-1">Chat with us on WhatsApp</h3>
            <p className="text-green-100 text-sm">Typically replies in minutes</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-slate-700 text-sm">
              Have questions about our rental services? We're here to help!
            </p>

            {/* CTA Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:shadow-lg transition-all hover:-translate-y-1"
            >
              💬 Start Chat on WhatsApp
            </a>

            <p className="text-xs text-slate-500 text-center">
              Available Monday - Sunday, 9 AM - 9 PM
            </p>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
