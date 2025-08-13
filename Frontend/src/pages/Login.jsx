import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../assets/loginimage.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const token =
        res.data.token || (typeof res.data === "string" ? res.data : null);
      if (token) {
        localStorage.setItem("token", token);
        navigate("/vote");
      } else {
        setErr("Token not returned from server");
      }
    } catch (error) {
      setErr(
        error?.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-400/50"></div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-purple-100 p-8 rounded-xl shadow-lg z-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Login to Your Account
          </h2>

          {err && <div className="text-red-500 mb-4 text-center">{err}</div>}

          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="p-3 border border-blue-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="p-3 border border-blue-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="mt-2 bg-blue-800 text-white p-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors">
              Login
            </button>
          </form>

          {/* Sign Up link */}
          <p className="mt-4 text-center text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
