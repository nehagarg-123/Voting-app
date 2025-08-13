import React, { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/signupimage.png";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); // clear any previous error

    try {
      await signup(form);
      navigate("/login"); // redirect after success
    } catch (error) {
      // show error from backend or default text
      if (error?.response?.data?.error) {
        setErr(error.response.data.error);
      } else {
        setErr("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${signupImage})` }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Signup card */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white/30 backdrop-blur-md border border-white/30 p-8 rounded-xl shadow-lg z-10">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

          {err && (
            <div className="bg-red-500/80 text-white py-2 px-4 rounded mb-4 text-center">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="p-3 rounded-md text-black placeholder-gray-700 bg-white/80 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              type="email"
              className="p-3 rounded-md text-black placeholder-gray-700 bg-white/80 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="p-3 rounded-md text-black placeholder-gray-700 bg-white/80 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Link to login page */}
          <p className="mt-4 text-center text-white">
            Already have an account?{" "}
            <span
              className="text-black hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
