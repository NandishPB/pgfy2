import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [dob, setDob] = useState('')
  const [adharNumber, setAdharNumber] = useState('')
  const [gender, setGender] = useState('')
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const { signin, signup } = useAuth()
  const navigate = useNavigate()

  // real-time debounced validation
  React.useEffect(() => {
    const handler = setTimeout(() => {
      const errors = {}
      if (mode === 'signup') {
        if (!name) errors.name = 'Full name is required'
        if (contactNumber && !validateContact(contactNumber)) errors.contact_number = 'Invalid contact number'
        if (adharNumber && adharNumber.length < 8) errors.adhar_number = 'Aadhar seems too short'
      }

      if (email) {
        if (!validateEmail(email)) errors.email = 'Invalid email'
      }

      if (password && password.length > 0 && password.length < 6) errors.password = 'Password must be at least 6 characters'

      // merge with existing fieldErrors but prefer new computed ones
      setFieldErrors(prev => ({ ...prev, ...errors }))
    }, 450)

    return () => clearTimeout(handler)
  }, [email, password, name, contactNumber, adharNumber, mode])

  const handleSignin = async (e) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    // client-side validation
    const errors = {}
    if (!email) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Invalid email'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }
    try {
      await signin(email, password)
      navigate('/hotels')
    } catch (err) {
      // show server validation or auth errors
      const data = err.response?.data
      if (data) {
        if (data.error) setError(data.error)
        else if (data.errors && Array.isArray(data.errors)) setError(data.errors.map(e => e.msg).join(', '))
        else setError(JSON.stringify(data))
      } else {
        setError('Sign in failed')
      }
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    // client-side validation
    const errors = {}
    if (!name) errors.name = 'Full name is required'
    if (!email) errors.email = 'Email is required'
    else if (!validateEmail(email)) errors.email = 'Invalid email'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    if (adharNumber && adharNumber.length < 8) errors.adhar_number = 'Aadhar seems too short'
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }
    try {
      const payload = {
        name,
        email,
        password,
        contact_number: contactNumber,
        dob: dob || null,
        adhar_number: adharNumber,
        gender
      }
      await signup(payload)
      // after signup, directly sign in
      await signin(email, password)
      navigate('/hotels')
    } catch (err) {
      const data = err.response?.data
      if (data) {
        if (data.error) setError(data.error)
        else if (data.errors && Array.isArray(data.errors)) setError(data.errors.map(e => e.msg).join(', '))
        else setError(JSON.stringify(data))
      } else {
        setError('Sign up failed')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">{mode === 'signin' ? 'Sign In' : 'Create account'}</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={mode === 'signin' ? handleSignin : handleSignup}>
        {mode === 'signup' && (
          <>
            <div className="mb-3">
              <label className="block text-sm">Full name</label>
              <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
              {fieldErrors.name && <div className="text-red-600 text-sm mt-1">{fieldErrors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="block text-sm">Contact number</label>
              <input className="w-full border p-2 rounded" value={contactNumber} onChange={e => { setContactNumber(e.target.value); setFieldErrors(prev => ({ ...prev, contact_number: undefined })); }} />
              {fieldErrors.contact_number && <div className="text-red-600 text-sm mt-1">{fieldErrors.contact_number}</div>}
            </div>
            <div className="mb-3">
              <label className="block text-sm">DOB</label>
              <input type="date" className="w-full border p-2 rounded" value={dob} onChange={e => setDob(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="block text-sm">Aadhar number</label>
              <input className="w-full border p-2 rounded" value={adharNumber} onChange={e => { setAdharNumber(e.target.value); setFieldErrors(prev => ({ ...prev, adhar_number: undefined })); }} />
              {fieldErrors.adhar_number && <div className="text-red-600 text-sm mt-1">{fieldErrors.adhar_number}</div>}
            </div>
            <div className="mb-3">
              <label className="block text-sm">Gender</label>
              <select className="w-full border p-2 rounded" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}
        <div className="mb-3">
          <label className="block text-sm">Email</label>
          <input type="email" className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          {fieldErrors.email && <div className="text-red-600 text-sm mt-1">{fieldErrors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="block text-sm">Password</label>
          <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
          {fieldErrors.password && <div className="text-red-600 text-sm mt-1">{fieldErrors.password}</div>}
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" type="submit">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</button>
          <button type="button" className="text-sm text-gray-600" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'Create account' : 'Have an account? Sign in'}</button>
        </div>
      </form>
    </div>
  )
}

function validateEmail(email) {
  // simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateContact(contact) {
  // allow optional +country and 10 digit number OR plain 10 digit
  // examples: +91XXXXXXXXXX or XXXXXXXXXX
  return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(contact)
}
