import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const res = await api.get('/bookings/my')
        if (mounted) setBookings(res.data.bookings || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load bookings')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [])

  const downloadReceipt = async (bookingId, bookingRef) => {
    try {
      const res = await api.get(`/bookings/${bookingId}/receipt`, { responseType: 'blob' })
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt_${bookingRef || bookingId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to download receipt')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">My Bookings</h2>
      {loading && <div className="mt-4">Loading...</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      <div className="mt-4 space-y-3">
        {bookings.map(b => (
          <div key={b.booking_id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{b.hotel_name}</div>
              <div className="text-sm text-gray-600">{b.check_in_date} → {b.check_out_date} · {b.nights} nights</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="font-semibold">₹{b.total_amount}</div>
                <div className="text-sm text-gray-500">Ref: {b.booking_reference || b.booking_id}</div>
              </div>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => downloadReceipt(b.booking_id, b.booking_reference)}>Receipt</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
