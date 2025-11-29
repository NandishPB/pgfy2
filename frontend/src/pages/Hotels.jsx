import React, { useEffect, useState } from 'react'
import api from '../api'
import HotelCard from '../components/HotelCard'

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const res = await api.get('/hotels', { params: q ? { q } : {} })
        if (mounted) setHotels(res.data.hotels || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load hotels')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [q])

  return (
    <div>
      <div className="bg-white p-4 rounded-lg card-shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Hotels</h2>
            <p className="mt-1 text-gray-600">Search and pick hotels from the backend seed data.</p>
          </div>
          <div className="flex items-center gap-2">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search hotels or city" className="border rounded px-3 py-2 w-64" />
            <button onClick={() => {}} className="bg-brand text-white px-4 py-2 rounded">Search</button>
          </div>
        </div>
      </div>

      {loading && <div className="mt-4">Loading...</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(h => (
          <HotelCard key={h.hotel_id} hotel={h} />
        ))}
      </div>
    </div>
  )
}
