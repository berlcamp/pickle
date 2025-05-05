'use client'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const serviceAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, serviceAnonKey)

interface FormTypes {
  player_a: string
  player_b: string
  contact_number: string
  address: string
  category: string
  tshirt_size_a: string
  tshirt_size_b: string
}

export default function Home() {
  const [saving, setSaving] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registrations, setRegistrations] = useState<FormTypes[] | []>([])
  const [viewReg, setViewReg] = useState(false)

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm<FormTypes>({
    mode: 'onSubmit'
  })

  const onSubmit = async (formdata: FormTypes) => {
    if (saving) return

    setSaving(true)

    void handleCreate(formdata)
  }

  const handleCreate = async (formdata: FormTypes) => {
    const params = {
      player_a: formdata.player_a,
      player_b: formdata.player_b,
      contact_number: formdata.contact_number,
      address: formdata.address,
      category: formdata.category,
      tshirt_size_a: formdata.tshirt_size_a,
      tshirt_size_b: formdata.tshirt_size_b,
      event: 'aruola'
    }

    try {
      const { data, error } = await supabase
        .from('pickle')
        .insert(params)
        .select()

      if (error) throw new Error(error.message)

      setSaving(false)
      setRegistered(true)
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('pickle')
        .select()
        .eq('event', 'aruola')

      if (data) {
        setRegistrations(data)
      }
    })()
  }, [registered])

  return (
    <main className="flex flex-col items-center justify-start min-h-screen">
      <Image alt="Pickle" src="/aruola.jpeg" width={500} height={24} />
      <div className="w-full flex flex-col items-center justify-start p-4">
        <div className="hidden bg-white text-gray-900 w-full sm:w-[500px] p-4">
          <div className="font-mono text-center text-lg mb-4">
            Click the links below to see matches schedules and results:
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 text-blue-900 underline underline-offset-2">
            <div className="font-mono">
              <Link href="/openmens">Open Mens</Link>
            </div>
            <div className="font-mono">
              <Link href="/openwomens">Open Womens</Link>
            </div>
            <div className="font-mono">
              <Link href="/openmixed">Open Mixed</Link>
            </div>
            <div className="font-mono">
              <Link href="/intermediate">Intermediate</Link>
            </div>
            <div className="font-mono">
              <Link href="/beginnermens">Beginner Mens</Link>
            </div>
            <div className="font-mono">
              <Link href="/beginnerwomens">Beginner Womens</Link>
            </div>
          </div>
        </div>
        <div className="bg-white text-gray-900 w-full sm:w-[500px] p-4">
          {registered && (
            <div className="font-mono text-center text-lg">
              You are successfully registered.
            </div>
          )}
          {!registered && (
            <>
              <div className="font-mono text-center text-lg">
                Register your team below:
              </div>
              <div className="font-mono">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col space-y-5">
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Player A
                      </div>
                      <div>
                        <input
                          {...register('player_a', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.player_a && (
                          <div className="app__error_message">
                            Player A is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Player B
                      </div>
                      <div>
                        <input
                          {...register('player_b', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.player_b && (
                          <div className="app__error_message">
                            Player B is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Contact #
                      </div>
                      <div>
                        <input
                          {...register('contact_number', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.contact_number && (
                          <div className="app__error_message">
                            Mobile No is required
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Address (City/Municipality)
                      </div>
                      <div>
                        <input
                          {...register('address', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.address && (
                          <div className="app__error_message">
                            Address is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Category
                      </div>
                      <div>
                        <select
                          {...register('category', { required: true })}
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        >
                          <option value="">Select category</option>
                          <option value="Novice">Novice</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Open Men">Open Men</option>
                          <option value="Open Mixed">Open Mixed</option>
                        </select>

                        {errors.category && (
                          <div className="app__error_message">
                            Category is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        T-shirt Size (Player A)
                      </div>
                      <div>
                        <select
                          {...register('tshirt_size_a')}
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        >
                          <option value="">Select size</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="2XL">2XL</option>
                          <option value="3XL">3XL</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        T-shirt Size (Player B)
                      </div>
                      <div>
                        <select
                          {...register('tshirt_size_b')}
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        >
                          <option value="">Select size</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="2XL">2XL</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-500 border border-emerald-600 font-bold px-2 py-1 text-lg text-white rounded-sm"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
        <div className="bg-white text-gray-900 w-full sm:w-[500px] p-4">
          <div className="font-mono text-center mb-4">
            <span
              className="cursor-pointer text-xs border border-gray-500 p-1"
              onClick={() => setViewReg(!viewReg)}
            >
              View Registrants
            </span>
          </div>
          {viewReg && (
            <div className="flex flex-col items-center justify-center space-y-2">
              {registrations?.map((r, i) => (
                <div key={i} className="uppercase text-xs">
                  {r.player_a} / {r.player_b} - {r.address}
                </div>
              ))}
              {registrations.length === 0 && (
                <div className="uppercase text-xs">No registrants yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
