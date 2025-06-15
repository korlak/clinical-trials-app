'use client'
import { useState } from 'react'
import { formSchema, FormData } from '@/lib/formSchema'
import { z } from 'zod'

type RawFormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  nctId: string
  agree: boolean 
}

export default function TrialForm({ nctId }: { nctId?: string }) {
  const [form, setForm] = useState<RawFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    nctId: nctId || '',
    agree: false,
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const applicationLetter = `I hope this message finds you well. My name is ${form.firstName} ${form.lastName}, and I am writing to express my strong interest in participating in your upcoming clinical trial ${form.nctId}.
You can contact me by replying directly to this email or reaching me by phone at ${form.phone} or ${form.email}
Thank you for considering my interest!`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const parsed = formSchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.errors[0].message)
      return
    }

    try {
      const res = await fetch('/api/Patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, applicationLetter }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSuccess(true)
      setForm({ firstName: '', lastName: '', phone: '', email: '', nctId: nctId || '', agree: false })
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Apply for Clinical Trial
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Your first name"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Your last name"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+380XXXXXXXXX"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        {/* NCT ID */}
        {nctId && (
          <div>
            <label htmlFor="nctId" className="block text-sm font-medium text-gray-700 mb-1">
              Trial ID
            </label>
            <input
              id="nctId"
              name="nctId"
              value={form.nctId}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        )}
        {/* Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Letter</label>
          <textarea
            value={applicationLetter}
            readOnly
            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
            rows={6}
          />
        </div>
        {/* Agree */}
        <div className="flex items-center">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={form.agree}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
            I agree to the privacy policy and terms
          </label>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md"
        >
          Submit Application
        </button>
        {/* Feedback */}
        {success && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            Your application was successfully submitted!
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
