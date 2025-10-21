'use client'

import { createClient } from '@supabase/supabase-js'
import { saveAs } from 'file-saver'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Player {
  id: number
  player_a: string
  player_b: string
  contact_number: string
  address: string
  club: string
  category: string
  tshirt_size_a: string
  tshirt_size_b: string
  tshirt_name_a: string
  tshirt_name_b: string
  proof: string
  agree: boolean
  flight: string | null // add this line
  status: string | null // add this line
}

const categories = [
  { name: 'novice', label: 'Novice' },
  { name: 'novicemen', label: 'Novice Men' },
  { name: 'bm', label: 'Beginner Men' },
  { name: 'bw', label: 'Beginner Women' },
  { name: 'bmx', label: 'Beginner Mixed' },
  { name: 'im', label: 'Intermediate Men' },
  { name: 'iw', label: 'Intermediate Women' },
  { name: 'open', label: 'Open' }
]

export default function ViewRegistrationsPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // ✅ You can store this password safely in .env.local
  const pagePassword = process.env.NEXT_PUBLIC_VIEW_PASSWORD || 'admin123'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPassword === pagePassword) {
      setAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password.')
    }
  }

  const handleFetch = async (selectedCategory: string) => {
    setLoading(true)
    setPlayers([])

    const { data, error } = await supabase
      .from('pickle')
      .select('*')
      .eq('category', selectedCategory)
      .eq('event', 'lopez')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error fetching data:', error.message)
    } else {
      setPlayers(data || [])
    }
    setLoading(false)
  }

  const handleExportExcel = () => {
    if (players.length === 0) {
      alert('No players to export.')
      return
    }

    // Format data for Excel
    const exportData = players.map((p, index) => ({
      '#': index + 1,
      'Player A': p.player_a,
      'Player B': p.player_b,
      'Contact Number': p.contact_number,
      Address: p.address,
      Club: p.club,
      Category: p.category,
      'T-Shirt Size A': p.tshirt_size_a,
      'T-Shirt Name A': p.tshirt_name_a,
      'T-Shirt Size B': p.tshirt_size_b,
      'T-Shirt Name B': p.tshirt_name_b,
      Payment: p.proof || '',
      Flight: p.flight || '',
      Status: p.status || ''
    }))

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, category || 'Players')

    // Create Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // Download
    const fileName = `Pickleball_${category}_Registrations.xlsx`
    saveAs(dataBlob, fileName)
  }

  const handleFlightChange = async (id: number, newFlight: string) => {
    try {
      const { error } = await supabase
        .from('pickle')
        .update({ flight: newFlight })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setPlayers((prev) =>
        prev.map((p, idx) => (p.id === id ? { ...p, flight: newFlight } : p))
      )
    } catch (err) {
      console.error('Error updating flight:', err)
      alert('Failed to update flight. Please try again.')
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pickle')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setPlayers((prev) =>
        prev.map((p, idx) => (p.id === id ? { ...p, status: newStatus } : p))
      )
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status. Please try again.')
    }
  }

  useEffect(() => {
    if (category) handleFetch(category)
  }, [category])

  // Group players by flight
  const groupedByFlight = Array.from({ length: 8 }).map((_, i) => {
    const flightName = `Flight ${i + 1}`
    const playersInFlight = players.filter((p) => p.flight === flightName)
    return { name: flightName, players: playersInFlight }
  })

  // 🔒 Show password gate first
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
          <h1 className="text-xl font-semibold text-center text-green-700 mb-4">
            Protected Page
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Please enter the admin password to view registrations.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700"
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ✅ If authenticated, show your existing table UI
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Banner Background */}
      <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden">
        <Image
          src="/banner.jpeg"
          alt="Pickle Tournament Banner"
          fill
          priority
          className="object-contain md:object-cover object-top brightness-75 transition-all duration-500"
        />
      </div>

      {/* Content */}
      <div className="relative md:-mt-16 flex flex-col items-center px-4">
        <div className="bg-white shadow-2xl rounded-2xl w-full p-8 md:p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            View Registered Players
          </h2>

          {/* Category Dropdown */}
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mb-8 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 text-gray-700"
            >
              <option value="">Select category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>
                  {cat.label}
                </option>
              ))}
            </select>

            {players.length > 0 && (
              <button
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Export to Excel
              </button>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center text-gray-500 py-8">
              Loading players...
            </div>
          ) : category && players.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No players registered under {category}.
            </div>
          ) : players.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm md:text-base">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Player A</th>
                    <th className="py-3 px-4 text-left">Player B</th>
                    <th className="py-3 px-4 text-left">Contact</th>
                    <th className="py-3 px-4 text-left">T-Shirt A</th>
                    <th className="py-3 px-4 text-left">T-Shirt B</th>
                    <th className="py-3 px-4 text-left">Proof of Payment</th>
                    <th className="py-3 px-4 text-left">Flight</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr
                      key={index}
                      className="border-b text-gray-600 border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{player.player_a}</td>
                      <td className="py-3 px-4">{player.player_b}</td>
                      <td className="py-3 px-4">
                        <div>{player.contact_number}</div>
                        <div>{player.club}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{player.tshirt_size_a}</div>
                        <div>{player.tshirt_name_a}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{player.tshirt_size_b}</div>
                        <div>{player.tshirt_name_b}</div>
                      </td>
                      <td className="py-3 px-4">
                        {player.proof ? (
                          <button
                            onClick={() => setSelectedImage(player.proof)}
                            className="focus:outline-none"
                          >
                            <Image
                              src={player.proof}
                              alt="Proof"
                              width={200}
                              height={200}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition"
                            />
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">No image</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={player.flight || ''}
                          onChange={(e) =>
                            handleFlightChange(player.id, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Flight</option>
                          {Array.from({ length: 8 }).map((_, i) => (
                            <option key={i + 1} value={`Flight ${i + 1}`}>
                              Flight {i + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={player.status || ''}
                          onChange={(e) =>
                            handleStatusChange(player.id, e.target.value)
                          }
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Status</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Refunded">Refunded</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !category && (
              <div className="text-center text-gray-500 py-8">
                Please select a category to view players.
              </div>
            )
          )}
        </div>
      </div>

      {/* --- FLIGHT BOXES --- */}
      {players.length > 0 && (
        <div className="relative mt-16 flex flex-col items-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {groupedByFlight.map((flight) => (
              <div
                key={flight.name}
                className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
              >
                <h2 className="font-semibold text-green-700 mb-3">
                  {flight.name}
                </h2>
                {flight.players.length > 0 ? (
                  <ul className="space-y-2">
                    {flight.players.map((p) => (
                      <li
                        key={p.id}
                        className="text-gray-700 text-sm border-b border-gray-100 pb-1"
                      >
                        {p.player_a} & {p.player_b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm italic">No players yet</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-xl shadow-xl p-4 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close"
            >
              ✕
            </button>

            <Image
              src={selectedImage}
              alt="Full Proof"
              width={800}
              height={800}
              className="w-full h-auto rounded-lg object-contain max-h-[70vh]"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm mt-20 mb-6">
        © {new Date().getFullYear()} Pickle Tournament. All rights reserved.
      </footer>
    </div>
  )
}
