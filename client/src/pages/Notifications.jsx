import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Clock, Info } from "lucide-react";
import http, { apiError } from "../api/http";
import Loading from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Alert from "../components/Alert";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/notifications");
      setNotifications(data.notifications);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await http.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await http.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated with your latest activities.</p>
        </div>
        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700" onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>
          Mark all as read
        </button>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}
      {loading ? <Loading label="Loading notifications" /> : null}

      {!loading && notifications.length === 0 ? (
        <EmptyState 
          icon={<Bell size={48} className="text-slate-300" />}
          title="All caught up!" 
          message="You have no new notifications at the moment." 
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`panel p-5 flex gap-5 transition-all duration-200 ${notif.read ? 'opacity-80' : 'border-l-4 border-l-primary-500 shadow-md'}`}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-primary-100 text-primary-600'}`}>
                <Bell size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title || "Notification"}</h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                <div className="mt-4 flex items-center gap-4">
                  {!notif.read && (
                    <button 
                      onClick={() => markRead(notif._id)}
                      className="text-xs font-bold text-primary-600 flex items-center gap-1 hover:underline"
                    >
                      <Check size={14} /> Mark as read
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif._id)}
                    className="text-xs font-bold text-red-400 flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
