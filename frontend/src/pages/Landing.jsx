import React from "react";
import { Link } from "react-router-dom";
import Landingimage from "../assets/Landingimage.png";

export default function LandingPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section
       className="min-h-screen w-full flex flex-col justify-center items-center text-white text-center px-6 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${Landingimage})`, // ✅ Fix template string
        }}
      >
        {/* Dark overlay for shadow effect */}
        <div className="absolute inset-0  bg-gradient-to-r from-blue-400 "></div>

        {/* Content on top of overlay */}
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-6xl text-black font-extrabold mb-4 drop-shadow-lg">
            A Modern Voting App
          </h1>
          <p className="text-xl text-black font-medium mb-6  drop-shadow-md">
            Secure. Real-Time. Transparent. Built with MERN Stack.
          </p>
          <Link to="/signup">
            <button className="bg-blue-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-10 text-center bg-gradient-to-r from-blue-100 to-yellow-800">
        <h2 className="text-4xl font-bold mb-6 text-purple-700">
          Why Choose Our Voting App?
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700">
          Our app ensures <span className="font-semibold text-purple-700">fair, secure, and real-time voting</span>. 
          It’s perfect for elections, polls, competitions, and any event where 
          <span className="font-semibold"> transparency </span> is the key.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-200 to-red-800 px-10">
        <h2 className="text-4xl font-bold text-center mb-10 text-indigo-800">
          🚀 Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-2xl border-l-4 border-purple-600 hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2 text-purple-700">
              🔒 Secure Login
            </h3>
            <p className="text-gray-600">
              Authentication with JWT & bcrypt to keep your data safe.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl border-l-4 border-blue-600 hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              📊 Live Results
            </h3>
            <p className="text-gray-600">
              Votes update in real-time with beautiful charts & graphs.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl border-l-4 border-green-600 hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              ⚡ Easy to Use
            </h3>
            <p className="text-gray-600">
              User-friendly interface so anyone can vote effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-10 text-center bg-gradient-to-r from-purple-900 to-red-100">
        <h2 className="text-4xl font-bold mb-10 text-black-900">How It Works</h2>
        <ol className="space-y-6 text-lg text-gray-700 max-w-2xl mx-auto">
          <li>1️⃣ <span className="font-semibold text-red-900">Register</span> an account securely.</li>
          <li>2️⃣ <span className="font-semibold text-red-900">Cast</span> your vote with one click.</li>
          <li>3️⃣ <span className="font-semibold text-red-900" >See Results</span> live & transparent.</li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p></p>
      </footer>
    </div>
  );
}
