import React from 'react'

export default function About() {
  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold">About Us</h2>
      <p className="mt-2 text-gray-700">PGfy is a lightweight hotel booking experience built to help travelers find great stays quickly. We combine a clean interface, fast search, and a straightforward booking flow so you can reserve rooms in seconds.</p>

      <h3 className="mt-4 text-lg font-medium">What we offer</h3>
      <ul className="list-disc ml-6 text-gray-700">
        <li>Curated hotel listings with transparent pricing</li>
        <li>Instant booking and downloadable receipts</li>
        <li>User profiles and booking history</li>
        <li>Responsive design for mobile and desktop</li>
      </ul>

      <h3 className="mt-4 text-lg font-medium">Our mission</h3>
      <p className="text-gray-700">We believe booking should be simple, fast, and trustworthy. PGfy focuses on removing friction from the booking process — no clutter, just the information you need to decide and confirm.</p>

      <h3 className="mt-4 text-lg font-medium">Get in touch</h3>
      <p className="text-gray-700">Have feedback or want to contribute? Open an issue in the repo or email <a className="text-brand" href="mailto:support@pgfy.example.com">support@pgfy.example.com</a>.</p>
    </div>
  )
}
