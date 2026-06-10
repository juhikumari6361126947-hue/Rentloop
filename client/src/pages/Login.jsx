import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Boxes } from "lucide-react";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../api/http";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form, admin);
      if (admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pt-12">
      <form className="panel space-y-6 p-8" onSubmit={submit}>
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
            <Boxes size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Access your rentals and marketplace dashboard.</p>
        </div>

        {error ? <Alert type="error">{error}</Alert> : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" checked={admin} onChange={(event) => setAdmin(event.target.checked)} />
            Login as admin
          </label>
          <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</button>
        </div>

        <button className="btn-primary w-full py-3" disabled={loading}>
          {loading ? "Logging in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link className="font-bold text-primary-600 hover:text-primary-700" to="/signup">
            Sign up for free
          </Link>
        </p>
      </form>
    </div>
  );
}
