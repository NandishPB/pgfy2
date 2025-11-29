import React, { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me')
        if (mounted) setProfile(res.data.user)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProfile()
    return () => { mounted = false }
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: profile.name,
        contact_number: profile.contact_number,
        dob: profile.dob,
        gender: profile.gender
      }
      const res = await api.put('/users/me', payload)
      setProfile(res.data.user)
      updateUser(res.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading profile...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!profile) return <div>No profile data</div>

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSave}>
        <div>
          <label className="block text-sm">Full name</label>
          <input className="w-full border p-2 rounded" value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm">Contact number</label>
          <input className="w-full border p-2 rounded" value={profile.contact_number || ''} onChange={e => setProfile({ ...profile, contact_number: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm">DOB</label>
            <input type="date" className="w-full border p-2 rounded" value={profile.dob ? profile.dob.split('T')[0] : ''} onChange={e => setProfile({ ...profile, dob: e.target.value })} />
          </div>
          <div className="w-40">
            <label className="block text-sm">Gender</label>
            <select className="w-full border p-2 rounded" value={profile.gender || ''} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}
