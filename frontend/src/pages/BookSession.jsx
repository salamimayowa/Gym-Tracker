import { useState } from 'react'
import { sessionAPI } from '../api'

export default function BookSession() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [startTime, setStartTime] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!startTime) {
        setError('Please select a date and time')
        setLoading(false)
        return
      }

      const formattedDateTime = startTime + ':00'
      const response = await sessionAPI.book({ startTime: formattedDateTime })
      
      if (response.data.responseCode === '00') {
        setSuccess('Session booked successfully!')
        setStartTime('')
      } else {
        setError(response.data.responseMessage || 'Failed to book session')
      }
    } catch (err) {
      setError(err.response?.data?.responseMessage || err.message || 'Failed to book session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-5xl">📅</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book a Session</h1>
            <p className="text-gray-500 mt-1">Schedule your next workout</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Date & Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">📍 Choose your preferred workout time</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? '⏳ Booking...' : '✓ Book Session'}
          </button>
        </form>
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-md p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-3">💡 Tips for Booking</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Book sessions during your most productive times</li>
          <li>• Allow time for warm-up and cool-down</li>
          <li>• Check available times for better options</li>
          <li>• Consistency is key to fitness success</li>
        </ul>
      </div>
    </div>
  )
}
