import { useState } from "react";
import { User, Lock, Bell, Globe, Shield, Save, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Settings updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your profile, security and preferences.</p>
      </div>

      <div className="flex gap-10 flex-col md:flex-row">
        {/* Tabs Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={20} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {success ? <div className="mb-6"><Alert type="success">{success}</Alert></div> : null}

          <div className="panel p-8">
            {activeTab === "profile" && (
              <form className="space-y-8" onSubmit={handleSave}>
                <div className="flex items-center gap-6 pb-8 border-b border-light-border">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-slate-400 font-bold text-3xl">
                      {user?.name?.charAt(0)}
                    </div>
                    <button type="button" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary-500 text-white shadow-lg border-2 border-white flex items-center justify-center hover:bg-primary-600 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Profile Picture</h3>
                    <p className="text-sm text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input className="input" defaultValue={user?.name} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <input className="input bg-slate-50" defaultValue={user?.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input className="input" defaultValue={user?.phone} placeholder="+91 0000000000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Address</label>
                    <input className="input" defaultValue={user?.address} placeholder="City, State" />
                  </div>
                </div>

                <div className="pt-6 border-t border-light-border flex justify-end">
                  <button className="btn-primary px-8" disabled={loading}>
                    <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form className="space-y-6" onSubmit={handleSave}>
                <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Current Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">New Password</label>
                    <input className="input" type="password" placeholder="Minimum 8 characters" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="pt-6 border-t border-light-border flex justify-end">
                  <button className="btn-primary px-8" disabled={loading}>
                    <Save size={18} /> {loading ? "Update Password" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {(activeTab === "notifications" || activeTab === "privacy") && (
              <div className="py-20 text-center">
                <Globe size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Coming Soon</h3>
                <p className="text-sm text-slate-500">We are currently working on these settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
