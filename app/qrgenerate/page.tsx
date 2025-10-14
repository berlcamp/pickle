'use client'

import QRCode from 'qrcode'
import React, { useRef, useState } from 'react'

export default function QRGeneratorPage() {
  const [inputUrl, setInputUrl] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const generateQRCode = async (url: string) => {
    try {
      setLoading(true)
      // Generate a Data URL and also draw it on the canvas for download/preview
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        margin: 2,
        scale: 8
      })

      setQrDataUrl(dataUrl)

      // draw on canvas
      const canvas = canvasRef.current
      if (canvas) {
        const img = new Image()
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (ctx) ctx.drawImage(img, 0, 0)
        }
        img.src = dataUrl
      }
    } catch (err) {
      console.error('QR generation error:', err)
      alert('Could not generate QR code. Please check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = inputUrl.trim()
    if (!url) return alert('Please enter a URL to generate a QR code.')

    // quick URL fix: add https:// if missing
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`

    await generateQRCode(normalized)
  }

  const handleDownload = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'qr-code.png'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleUseSupabaseUrl = (publicUrl: string) => {
    setInputUrl(publicUrl)
    generateQRCode(publicUrl)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-3">QR Code Generator</h1>
        <p className="text-sm text-slate-500 mb-6">
          Paste a URL (or your Supabase public file URL) and generate a
          downloadable QR code users can scan.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
          <input
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="https://example.com or paste your Supabase public URL"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <button
            type="submit"
            className="bg-sky-600 text-white px-4 py-2 rounded-lg shadow-sm disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-slate-50 flex flex-col items-center">
            <p className="text-sm text-slate-600 mb-3">Preview</p>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-64 h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-slate-400 border rounded">
                  <span>No QR yet</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-green-600 text-white rounded-lg shadow-sm disabled:opacity-60"
                disabled={!qrDataUrl}
              >
                Download PNG
              </button>

              <button
                onClick={() => {
                  if (!qrDataUrl) return
                  navigator.share?.({ url: inputUrl })
                }}
                className="px-3 py-2 bg-slate-200 rounded-lg"
                disabled={!qrDataUrl || !navigator.share}
              >
                Share Link
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="border rounded-lg p-4 bg-slate-50">
            <p className="text-sm text-slate-600 mb-3">Options & Tools</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500">Quick examples</label>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-white border rounded text-slate-700 text-sm"
                    onClick={() =>
                      handleUseSupabaseUrl(
                        'https://example.supabase.co/storage/v1/object/public/publicbucket/proofs/sample.jpg'
                      )
                    }
                  >
                    Sample Supabase URL
                  </button>

                  <button
                    className="px-2 py-1 bg-white border rounded text-slate-700 text-sm"
                    onClick={() =>
                      handleUseSupabaseUrl('https://example.com/event-register')
                    }
                  >
                    Example landing page
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500">Help</label>
                <p className="text-sm text-slate-600 mt-2">
                  If users scan the QR and get a blank page, ensure the URL
                  starts with <code>https://</code> and is publicly accessible.
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-500">Tips</label>
                <ul className="list-disc list-inside text-sm text-slate-600 mt-2">
                  <li>
                    Use the Supabase public URL you saved after upload so users
                    can scan directly to the uploaded image or page.
                  </li>
                  <li>
                    Print the QR at a decent size (at least 5cm x 5cm) for easy
                    scanning.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-6 text-sm text-slate-500">
          Need the QR to include parameters (e.g., player ID)? Tell me the
          format and I’ll add a button to auto-build the URL.
        </footer>
      </div>
    </div>
  )
}
