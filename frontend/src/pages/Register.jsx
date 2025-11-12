import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ firstname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/register", {
        firstname: form.firstname,
        email: form.email,
        password: form.password
      });

      setMessage(res.data.message || "Registration successful!");
      setForm({ firstname: "", email: "", password: "" }); // Clear form
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT PROMO PANEL */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-4/5 bg-gradient-to-b from-purple-500 via-purple-400 to-indigo-400 rounded-3xl p-12 shadow-2xl transform -rotate-[1deg]">
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center mb-6 shadow">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M32 10C36.4183 10 40 13.5817 40 18C40 22.4183 36.4183 26 32 26C27.5817 26 24 22.4183 24 18C24 13.5817 27.5817 10 32 10Z" fill="white" fillOpacity="0.95"/>
                  <path d="M22 34C18.6863 34 16 36.6863 16 40V44H48V40C48 36.6863 45.3137 34 42 34H22Z" fill="white" fillOpacity="0.95"/>
                </svg>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                HEALTHCARE
              </h2>

              <p className="text-sm max-w-xs">
                All your healthcare needs <br /> on your fingertips
              </p>

              <div className="mt-8 w-full">
                <div className="h-3 bg-white/10 rounded-full mb-3" />
                <div className="h-3 bg-white/10 rounded-full w-5/6" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT REGISTER PANEL */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M32 12C35.866 12 39 15.134 39 19C39 22.866 35.866 26 32 26C28.134 26 25 22.866 25 19C25 15.134 28.134 12 32 12Z" fill="white"/>
                    <path d="M24 34C21.7909 34 20 35.7909 20 38V42H44V38C44 35.7909 42.2091 34 40 34H24Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                  <p className="text-sm text-gray-500">Sign up to get started</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  FIRST NAME
                </label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md transition ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-105"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {message && (
              <div
                className={`mt-5 text-sm rounded-md px-4 py-3 text-center ${
                  message.toLowerCase().includes("successful")
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {message}
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
