'use client'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const serviceAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const supabase = createClient(supabaseUrl, serviceAnonKey)

interface FormTypes {
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
  proof?: FileList
  agree: boolean
}

const categories = [
  // {
  //   name: 'novice',
  //   label: 'Novice',
  //   link: 'category/novice'
  // },
  {
    name: 'novicemen',
    label: 'Novice Men',
    link: 'category/novicemen'
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

export default function Home() {
  const [saving, setSaving] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registrations, setRegistrations] = useState<FormTypes[] | []>([])
  const [viewReg, setViewReg] = useState(false)

  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  )

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<FormTypes>({
    mode: 'onSubmit'
  })

  const onSubmit = async (formdata: FormTypes) => {
    if (saving) return
    setSaving(true)
    await handleCreate(formdata)
  }

  const handleCreate = async (formdata: FormTypes) => {
    if (isFull(formdata.category)) {
      alert('Sorry, this category is already full.')
      setSaving(false)
      return
    }

    let proofPath = null

    // 🔹 1. Upload proof of payment file if exists

    if (formdata.proof && formdata.proof.length > 0) {
      let file = formdata.proof[0]

      // Convert HEIC/WEBP to JPEG if needed
      if (
        !file.type.startsWith('image/jpeg') &&
        !file.type.startsWith('image/png')
      ) {
        const img = await createImageBitmap(file)
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Failed to get canvas context')
        ctx.drawImage(img, 0, 0)
        // const blob = await new Promise((resolve) =>
        //   canvas.toBlob(resolve, 'image/jpeg', 0.9)
        // )
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b)
              else reject(new Error('Canvas toBlob() failed'))
            },
            'image/jpeg',
            0.9
          )
        })
        file = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
          type: 'image/jpeg'
        })
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${formdata.player_a
        .replace(/\s+/g, '_')
        .toLowerCase()}.${fileExt}`
      const filePath = `proofs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('publicbucket')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        alert(
          'Error uploading proof of payment. Please try again or use Chrome.'
        )
        setSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('publicbucket')
        .getPublicUrl(filePath)

      proofPath = publicUrlData.publicUrl
    }

    // 🔹 2. Insert registration record into pickle table
    const params = {
      player_a: formdata.player_a,
      player_b: formdata.player_b,
      contact_number: formdata.contact_number,
      address: formdata.address,
      category: formdata.category,
      club: formdata.club,
      tshirt_size_a: formdata.tshirt_size_a,
      tshirt_size_b: formdata.tshirt_size_b,
      tshirt_name_a: formdata.tshirt_name_a,
      tshirt_name_b: formdata.tshirt_name_b,
      proof: proofPath, // store proof path here
      event: 'lopez'
    }

    try {
      const { error } = await supabase.from('pickle').insert(params).select()
      if (error) throw new Error(error.message)

      setRegistered(true)
      reset()
    } catch (error) {
      console.error('Insert error:', error)
      alert('Error saving registration.')
    } finally {
      setSaving(false)
    }
  }

  const getRemainingSlots = (categoryName: string) => {
    const count = categoryCounts[categoryName] || 0
    const limit =
      categoryName === 'novicemen' || categoryName === 'novicemen' ? 32 : 20
    const remaining = limit - count
    return remaining > 0 ? remaining : 0
  }

  const isFull = (categoryName: string) => getRemainingSlots(categoryName) === 0

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('pickle')
        .select('category')
        .eq('event', 'lopez')

      if (error) {
        console.error('Error fetching data:', error)
        return
      }

      // Count number of registrants per category
      const counts: Record<string, number> = {}
      data?.forEach((row) => {
        counts[row.category] = (counts[row.category] || 0) + 1
      })

      setCategoryCounts(counts)
      setRegistrations(data as any)
    })()
  }, [registered])

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Banner */}
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

      <div className="w-full flex flex-col items-center justify-start p-8">
        <div className="-mt-44 border border-gray-100 rounded-2xl bg-white p-4 z-50">
          {/* Hidden Section for Links */}
          <div className="hidden bg-white text-gray-900 w-full p-4">
            <div className="font-mono text-center text-lg mb-4">
              Click the links below to see match schedules and results:
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 text-blue-900 underline underline-offset-2">
              <Link target="_blank" href="/novice">
                Novice
              </Link>
              <Link target="_blank" href="/beginnermens">
                Beginner Mens
              </Link>
              <Link target="_blank" href="/beginnerwomens">
                Beginner Womens
              </Link>
              <Link target="_blank" href="/intermediatemen">
                Intermediate Mens
              </Link>
              <Link target="_blank" href="/intermediatewomen">
                Intermediate Womens
              </Link>
              <Link target="_blank" href="/openmens">
                Open Mens
              </Link>
              <Link target="_blank" href="/openmixed">
                Open Mixed
              </Link>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white text-gray-900 w-full p-4">
            {registered ? (
              <div className="font-mono text-center text-lg">
                ✅ You are successfully registered.
              </div>
            ) : (
              <>
                {/* Title */}
                <div className="text-center space-y-8">
                  <div className="text-3xl font-bold text-green-700">
                    <div>1st Asenso Lopez Jaena Pickleball Tournament</div>
                    <div className="text-base text-green-800">
                      November 22-23 2025
                    </div>
                  </div>

                  {/* Registration Fee Section */}
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl inline-block px-6 py-4 text-sm md:text-base shadow-sm">
                    <h2 className="text-emerald-700 font-semibold text-lg mb-2 text-center">
                      Registration Fee
                    </h2>
                    <div className="grid grid-cols-1 gap-2 text-gray-700 text-left">
                      <div className="flex justify-between border-b border-gray-100 pb-1 space-x-2">
                        <div>
                          <div>Novice</div>
                          <div className="text-xs italic text-gray-500">
                            (Exclusive only for Players Residing in Misamis
                            Occidental)
                          </div>
                        </div>
                        <span className="font-medium">₱600/player</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1 space-x-2">
                        <span>Beginner</span>
                        <span className="font-medium">₱700/player</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1 space-x-2">
                        <span>Intermediate</span>
                        <span className="font-medium">₱800/player</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1 space-x-2">
                        <span>Open</span>
                        <span className="font-medium">₱1,000/player</span>
                      </div>
                    </div>
                    <div className="mt-4 text-emerald-700 mb-2 text-center">
                      <div>
                        You can pay through GCash:{' '}
                        <span className="font-bold">
                          09765311269 / Paul Thomas Saladaga
                        </span>
                      </div>
                      <div className="italic text-sm">
                        (Please capture a photo of your transaction as proof of
                        payment)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-6 font-mono text-center text-lg">
                  Register your team below:
                </div>

                <div className="font-mono">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-6">
                      {/* Player A */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Player A (Full name required)
                        </div>
                        <input
                          {...register('player_a', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.player_a && (
                          <div className="app__error_message">
                            Player A is required
                          </div>
                        )}
                      </div>

                      {/* Player B */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Player B (Full name required)
                        </div>
                        <input
                          {...register('player_b', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.player_b && (
                          <div className="app__error_message">
                            Player B is required
                          </div>
                        )}
                      </div>

                      {/* Contact */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Contact #
                        </div>
                        <input
                          {...register('contact_number', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.contact_number && (
                          <div className="app__error_message">
                            Mobile No is required
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Address (City/Municipality)
                        </div>
                        <input
                          {...register('address', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.address && (
                          <div className="app__error_message">
                            Address is required
                          </div>
                        )}
                      </div>

                      {/* Club Name */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Club Name
                        </div>
                        <input
                          {...register('club', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.address && (
                          <div className="app__error_message">
                            Club Name is required
                          </div>
                        )}
                      </div>

                      {/* Category */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Category
                        </div>
                        <select
                          {...register('category', { required: true })}
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat, idx) => {
                            const remaining = getRemainingSlots(cat.name)
                            const full = isFull(cat.name)
                            return (
                              <option
                                key={idx}
                                value={cat.name}
                                disabled={full}
                                className={full ? 'text-gray-400' : ''}
                              >
                                {cat.label} —{' '}
                                {full
                                  ? 'FULL'
                                  : `${remaining} slot${
                                      remaining > 1 ? 's' : ''
                                    } left`}
                              </option>
                            )
                          })}
                        </select>
                        {errors.category && (
                          <div className="app__error_message">
                            Category is required
                          </div>
                        )}
                      </div>

                      {/* Tshirt Sizes */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          T-shirt Size (Player A)
                        </div>
                        <select
                          {...register('tshirt_size_a', { required: true })}
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        >
                          <option value=""></option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="2XL">2XL</option>
                          <option value="3XL">3XL</option>
                        </select>
                        {errors.tshirt_size_a && (
                          <div className="app__error_message">
                            T-shirt Size is required
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          T-shirt Size (Player B)
                        </div>
                        <select
                          {...register('tshirt_size_b', { required: true })}
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        >
                          <option value=""></option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="2XL">2XL</option>
                          <option value="3XL">3XL</option>
                        </select>
                        {errors.tshirt_size_b && (
                          <div className="app__error_message">
                            T-shirt Size is required
                          </div>
                        )}
                      </div>

                      {/* Name on Tshirt */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Name on T-shirt (Player 1)
                        </div>
                        <input
                          {...register('tshirt_name_a', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.tshirt_name_a && (
                          <div className="app__error_message">
                            Name on T-shirt is required
                          </div>
                        )}
                      </div>
                      {/* Name on Tshirt */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Name on T-shirt (Player 2)
                        </div>
                        <input
                          {...register('tshirt_name_b', { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.tshirt_name_b && (
                          <div className="app__error_message">
                            Name on T-shirt is required
                          </div>
                        )}
                      </div>

                      {/* Proof of Payment */}
                      <div>
                        <div className="text-gray-600 font-medium text-sm">
                          Upload Proof of Payment
                        </div>
                        <input
                          {...register('proof', { required: true })}
                          type="file"
                          accept="image/*,application/pdf"
                          className="w-full text-sm py-1 px-2 border border-gray-300 rounded-sm"
                        />
                        {errors.proof && (
                          <div className="app__error_message">
                            Proof of payment is required
                          </div>
                        )}
                      </div>

                      {/* Terms & Disclaimer */}
                      <div className="flex items-start space-x-2 mt-4">
                        <input
                          {...register('agree', { required: true })}
                          type="checkbox"
                          id="agree"
                          className="mt-1"
                        />
                        <label
                          htmlFor="agree"
                          className="text-sm text-gray-600"
                        >
                          I have read and agree to the{' '}
                          <Link
                            href="/terms"
                            target="_blank"
                            className="text-green-600 underline"
                          >
                            terms and disclaimer
                          </Link>
                          .
                        </label>
                      </div>
                      {errors.agree && (
                        <div className="app__error_message">
                          You need to agree our terms to continue
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-500 border border-emerald-600 font-bold px-2 py-1 text-lg text-white rounded-sm"
                      >
                        {saving ? 'Saving...' : 'Register'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>

          {/* View Registrants */}
          <div className="hidden bg-white text-gray-900 w-full sm:w-[500px] p-4">
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
      </div>
    </div>
  )
}
