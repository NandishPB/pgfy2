import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <section className="hero-gradient py-16">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Find & book hotels, fast.</h1>
          <p className="mt-4 text-gray-700 text-lg">Compare prices, read reviews and book rooms with instant confirmation.</p>

          <div className="mt-6 bg-white p-4 rounded-lg card-shadow">
            <div className="flex gap-2">
              <input className="flex-1 border rounded px-3 py-2" placeholder="Enter city or hotel" />
              <Link to="/hotels" className="bg-brand text-white px-4 py-2 rounded">Search</Link>
            </div>
            <div className="mt-3 text-sm text-gray-500">Popular: Mumbai · Delhi · Bangalore · Goa</div>
          </div>

          <div className="mt-6 flex gap-4">
            <Link to="/hotels" className="text-sm text-gray-600 hover:text-brand">Hotels</Link>
            <Link to="/about" className="text-sm text-gray-600 hover:text-brand">About</Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="w-full h-64 bg-gradient-to-tr from-orange-50 to-white rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-brand">PGfy</div>
              <div className="mt-2 text-gray-600">Simple hotel booking UI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
