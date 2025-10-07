'use client'

import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const serviceAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, serviceAnonKey)

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    player1: '',
    player2: '',
    category: '',
    contact: '',
    tshirt1: '',
    tshirt2: '',
    club: '',
    proof: null as File | null,
    agree: false
  })

  const [saving, setSaving] = useState(false)
  const [registered, setRegistered] = useState(false)

  const categories = [
    'Novice',
    'Beginner Men',
    'Beginner Women',
    'Beginner Mixed',
    'Intermediate Men',
    'Intermediate Women',
    'Open'
  ]

  const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, proof: file }))
  }

  // 🔹 Handle Supabase insert
  const handleCreate = async () => {
    const params = {
      player_a: formData.player1,
      player_b: formData.player2,
      contact_number: formData.contact,
      category: formData.category,
      tshirt_size_a: formData.tshirt1,
      tshirt_size_b: formData.tshirt2,
      club_name: formData.club,
      event: 'aruola'
    }

    try {
      const { data, error } = await supabase
        .from('pickle')
        .insert(params)
        .select()

      if (error) throw new Error(error.message)
      setRegistered(true)
      alert('Registration successful!')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your registration.')
    } finally {
      setSaving(false)
    }
  }

  // 🔹 Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agree) {
      alert('Please agree to the disclaimer before submitting.')
      return
    }

    setSaving(true)
    await handleCreate()
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Banner Background */}
      <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden">
        <Image
          src="/banner.jpeg"
          alt="Pickle Tournament Banner"
          fill
          priority
          className="object-contain md:object-cover object-[top_center] brightness-75 transition-all duration-500"
          sizes="100vw"
        />
      </div>

      {/* Floating Registration Form */}
      <div className="relative -mt-16 md:-mt-20 flex justify-center px-4">
        {registered ? (
          <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-10 text-center border border-gray-100">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              🎉 Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for registering. We’ll contact you soon for
              confirmation.
            </p>
            <Link
              href="/"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8 md:p-10 space-y-6 border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
              Register Your Team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Player 1
                </label>
                <input
                  type="text"
                  name="player1"
                  required
                  value={formData.player1}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter Player 1 name"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Player 2
                </label>
                <input
                  type="text"
                  name="player2"
                  required
                  value={formData.player2}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter Player 2 name"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="09XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  T-shirt Size (Player 1)
                </label>
                <select
                  name="tshirt1"
                  required
                  value={formData.tshirt1}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select size</option>
                  {tshirtSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  T-shirt Size (Player 2)
                </label>
                <select
                  name="tshirt2"
                  required
                  value={formData.tshirt2}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select size</option>
                  {tshirtSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Club Name
                </label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Proof of Payment
              </label>
              <input
                type="file"
                name="proof"
                accept="image/*,application/pdf"
                required
                onChange={handleFileChange}
                className="w-full border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1"
                required
              />
              <label className="text-sm text-gray-600">
                I have read and agree to the{' '}
                <Link href="/terms" className="text-green-600 underline">
                  terms and disclaimer
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Submit Registration
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm mt-20 mb-6">
        © {new Date().getFullYear()} Pickle Tournament. All rights reserved.
      </footer>
    </div>
  )
}
