import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token') // check login status

  const handleLogout = () => {
    localStorage.removeItem('token') // remove token
    navigate('/') // go to landing page
  }

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-end gap-4 items-center shadow-md fixed top-0 left-0 z-50">
      {token ? (
        <>
          <Link
            to="/results"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
          >
            Result
          </Link>
          <Link
            to="/leaderboard"
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
          >
            Leaderboard
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-800 transition"
        >
          Login
        </Link>
      )}
    </nav>
  )
}
