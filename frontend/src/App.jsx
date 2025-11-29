import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import About from './pages/About'
import Profile from './pages/Profile'
import Bookings from './pages/Bookings'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'

function Header() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  return (
    <>
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold">PG</div>
            <span className="text-2xl font-extrabold text-gray-800">PGfy</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <Link to="/hotels" className="hover:text-brand">Hotels</Link>
            <Link to="/about" className="hover:text-brand">About</Link>
            <Link to="/hotels" className="hover:text-brand">Offers</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-80">
              <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Enter city or hotel" />
              <button className="ml-2 bg-brand text-white px-3 py-1 rounded-full text-sm">Search</button>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/bookings" className="text-sm text-gray-700 hover:text-brand">My Bookings</Link>
              <Link to="/profile" className="text-sm text-gray-700 hover:text-brand">{user.name}</Link>
              <button onClick={logout} className="text-sm text-gray-500">Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="bg-brand text-white px-4 py-2 rounded-full text-sm">Sign In</Link>
          )}

          {/* Mobile hamburger */}
          <button aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)} className="md:hidden ml-2 p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
      {/* Mobile menu overlay */}
      <div className={`md:hidden fixed inset-0 z-40 transition-transform ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-black opacity-30" onClick={() => setMobileOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">PG</div>
              <div className="font-bold">PGfy</div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            <Link to="/hotels" onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Hotels</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">About</Link>
            <Link to="/hotels" onClick={() => setMobileOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Offers</Link>
          </nav>

          <div className="mt-6 border-t pt-4">
            {user ? (
              <>
                <div className="font-medium">{user.name}</div>
                <Link to="/bookings" onClick={() => setMobileOpen(false)} className="block mt-2 text-sm text-gray-600">My Bookings</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block mt-1 text-sm text-gray-600">Profile</Link>
                <button onClick={() => { logout(); setMobileOpen(false) }} className="mt-3 bg-red-50 text-red-600 px-3 py-2 rounded">Logout</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="block bg-brand text-white text-center px-4 py-2 rounded">Sign In / Sign Up</Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
