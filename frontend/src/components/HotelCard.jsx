import React from 'react'
import { Link } from 'react-router-dom'

export default function HotelCard({ hotel }) {
  return (
    <Link to={`/hotels/${hotel.hotel_id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-md transition">
        <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">Image</div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
              <p className="text-sm text-gray-600">{hotel.address}, {hotel.city}</p>
            </div>
            <div className="text-right">
              <div className="text-brand font-bold text-lg">₹{hotel.price_per_night}</div>
              <div className="text-sm text-gray-500">{hotel.available_rooms} rooms</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">{hotel.average_rating ? `${hotel.average_rating} ★` : 'No rating'}</div>
            <div className="text-xs text-gray-500">{hotel.total_reviews || 0} reviews</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
