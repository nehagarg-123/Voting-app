import React from 'react'
import { Link } from 'react-router-dom'
import Landingimage from '../assets/Landingimage.png'

export default function Landing() {
  return (
    <div
      className=" h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Landingimage})` }}
    >
      {/* Semi-transparent black overlay */}
      <div className="absolute inset-0 bg-[rgba(9,9,12,0.6)]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full items-center p-4">
        {/* Headline */}
        <h1 className="text-white font-bold text-center text-shadow-lg max-w-[900px] leading-tight pt-20 pb-8 text-[clamp(2.5rem,5vw,4rem)]">
          A modern voting app with live results and beautiful visualizations.
        </h1>

        {/* Push button down */}
        <div className="flex-grow flex items-center justify-center">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-lg bg-indigo-600 text-white text-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}
