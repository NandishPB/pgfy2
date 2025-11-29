import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

function formatDateInput(date) {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function HotelDetail() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checkIn, setCheckIn] = useState(formatDateInput(new Date()))
  const [checkOut, setCheckOut] = useState(formatDateInput(new Date(Date.now() + 24*60*60*1000)))
  const [guests, setGuests] = useState(1)
  const [rooms, setRooms] = useState(1)
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    let mounted = true
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hotels/${id}`)
        if (mounted) setHotel(res.data.hotel)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load hotel')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchHotel()
    return () => { mounted = false }
  }, [id])

  const calcNights = () => {
    const a = new Date(checkIn)
    const b = new Date(checkOut)
    const diff = Math.ceil((b - a) / (1000*60*60*24))
    return diff > 0 ? diff : 0
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingSuccess(null)
    try {
      const nights = calcNights()
      if (nights <= 0) throw new Error('Check-out must be after check-in')
      const room_price = hotel.price_per_night || 0
      const total_amount = room_price * nights * rooms
      const payload = {
        hotel_id: hotel.hotel_id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        number_of_guests: guests,
        number_of_rooms: rooms,
        room_price,
        nights,
        total_amount
      }
      const res = await api.post('/bookings', payload)
      setBookingSuccess(res.data.booking)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

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

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!hotel) return <div>Hotel not found</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">{hotel.name}</h1>
        <p className="text-gray-600 mt-2">{hotel.address}, {hotel.city}, {hotel.state}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-700">Phone: {hotel.phone} · Email: {hotel.email}</p>
          <p className="text-sm text-gray-700">Rating: {hotel.average_rating || 'N/A'} ({hotel.total_reviews || 0} reviews)</p>
        </div>
      </div>

      <aside className="bg-white p-6 rounded shadow">
        <div className="text-right mb-4">
          <div className="text-xl font-bold text-indigo-600">₹{hotel.price_per_night}</div>
          <div className="text-sm text-gray-500">Per night</div>
        </div>

        {!user && <div className="mb-4 text-sm text-gray-700">Please sign in to book.</div>}

        <form onSubmit={handleBooking} className="space-y-3">
          <div>
            <label className="block text-sm">Check-in</label>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm">Check-out</label>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm">Guests</label>
              <input type="number" min={1} value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full border p-2 rounded" />
            </div>
            <div className="w-32">
              <label className="block text-sm">Rooms</label>
              <input type="number" min={1} value={rooms} onChange={e => setRooms(Number(e.target.value))} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Nights: {calcNights()}</div>
              <div className="text-lg font-semibold">Total: ₹{(hotel.price_per_night || 0) * calcNights() * rooms}</div>
            </div>
          </div>

          <div>
            <button disabled={!user || bookingLoading} className={`w-full px-4 py-2 rounded text-white ${!user ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{bookingLoading ? 'Booking...' : 'Book Now'}</button>
          </div>
        </form>

        {bookingSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded">
            <div className="font-medium text-green-700">Booking created</div>
            <div className="text-sm text-gray-700 mt-1">Reference: {bookingSuccess.booking_reference || bookingSuccess.booking_id}</div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => downloadReceipt(bookingSuccess.booking_id, bookingSuccess.booking_reference)}>Download Receipt</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
