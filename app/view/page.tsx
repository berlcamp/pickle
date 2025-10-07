'use client'

import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Player {
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
}

const categories = [
  {
    name: 'novice',
    label: 'Novice',
    link: 'category/novice'
  },
  {
    name: 'bm',
    label: 'Beginner Men',
    link: 'category/bm'
  },
  {
    name: 'bw',
    label: 'Beginner Women',
    link: 'category/bw'
  },
  {
    name: 'bmx',
    label: 'Beginner Mixed',
    link: 'category/bmx'
  },
  {
    name: 'im',
    label: 'Intermediate Men',
    link: 'category/im'
  },
  {
    name: 'iw',
    label: 'Intermediate Women',
    link: 'category/iw'
  },
  {
    name: 'open',
    label: 'Open',
    link: 'category/open'
  }
]

export default function ViewRegistrationsPage() {
  const [category, setCategory] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)

  const handleFetch = async (selectedCategory: string) => {
    setLoading(true)
    setPlayers([])

    const { data, error } = await supabase
      .from('pickle')
      .select('*')
      .eq('category', selectedCategory)
      .order('id', { ascending: false })

    if (error) {
      console.error('Error fetching data:', error.message)
    } else {
      setPlayers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (category) handleFetch(category)
  }, [category])

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
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-5xl p-8 md:p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            View Registered Players
          </h2>

          {/* Category Dropdown */}
          <div className="flex justify-center mb-8">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border md:w-1/2 border-gray-300 rounded-lg p-3 text-gray-700"
            >
              <option value="">Select category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>
                  {cat.label}
                </option>
              ))}
            </select>
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
                      <td className="py-3 px-4">{player.contact_number}</td>
                      <td className="py-3 px-4">{player.tshirt_size_a}</td>
                      <td className="py-3 px-4">{player.tshirt_size_b}</td>
                      <td className="py-3 px-4">
                        {player.proof ? (
                          <Image
                            src={player.proof}
                            alt="Proof"
                            width={200}
                            height={200}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No image</span>
                        )}
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

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm mt-20 mb-6">
        © {new Date().getFullYear()} Pickle Tournament. All rights reserved.
      </footer>
    </div>
  )
}
