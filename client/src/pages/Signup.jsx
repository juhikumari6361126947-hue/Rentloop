import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes } from "lucide-react";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../api/http";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg pt-12">
      <form className="panel space-y-6 p-8" onSubmit={submit}>
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
            <Boxes size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join RentLoop to start renting or listing items.</p>
        </div>

        {error ? <Alert type="error">{error}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              className="input"
              placeholder="John Doe"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone Number</label>
            <input
              className="input"
              type="tel"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input
              className="input"
              placeholder="City, State"
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            className="input"
            type="password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            minLength={8}
          />
        </div>

        <button className="btn-primary w-full py-3" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-bold text-primary-600 hover:text-primary-700" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
