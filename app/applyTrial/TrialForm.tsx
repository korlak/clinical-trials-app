'use client'
import { useState } from 'react'

export default function TrialForm({ nctId }: { nctId?: string }) {
  const [form, setForm] = useState({
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
    if (!form.firstName || !form.lastName || !form.phone || !form.email) {
      setError('Всі поля обов’язкові')
      return
    }

    if (!form.agree) {
      setError('Ви повинні погодитися з політикою конфіденційності')
      return
    }
    try {
      const res = await fetch('/api/Patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          applicationLetter,
        }),
      })
      if (!res.ok) throw new Error('Помилка збереження')
      setSuccess(true)
      setForm({ firstName: '', lastName: '', phone: '', email: '', nctId: nctId || '', agree: false })
    } catch (err: any) {
      setError(err.message || 'Сталася невідома помилка')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Заявка на участь у дослідженні
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Ім'я
            </label>
            <input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Ваше ім'я"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Прізвище
            </label>
            <input
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Ваше прізвище"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Номер телефону
          </label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+380 XX XXX XX XX"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Електронна пошта
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        {nctId && (
          <div>
            <label htmlFor="nctId" className="block text-sm font-medium text-gray-700 mb-1">
              Код дослідження
            </label>
            <input
              id="nctId"
              name="nctId"
              value={form.nctId}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Лист
          </label>
          <textarea
            value={applicationLetter}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            rows={6}
          />
        </div>
        <div className="flex items-center">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={form.agree}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            required
          />
          <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">
            Я погоджуюсь з політикою конфіденційності та умовами використання
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          Подати заявку
        </button>
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Дані успішно збережено! Ми зв'яжемося з вами найближчим часом.</span>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  )
}