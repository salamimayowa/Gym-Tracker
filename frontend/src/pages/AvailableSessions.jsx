import { useState } from 'react'
import { sessionAPI } from '../api'

export default function AvailableSessions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableSessions, setAvailableSessions] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await sessionAPI.available({ date: selectedDate })
      if (response.data.hours) {
        setAvailableSessions(response.data)
      } else {
        setError('No available sessions for this date')
      }
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Failed to fetch available sessions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-5xl">🕐</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Sessions</h1>
            <p className="text-gray-500 mt-1">Find open time slots for your workouts</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Date
            </label>
            <div className="flex gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔍 Searching...' : '🔍 Search'}
              </button>
            </div>
          </div>
        </form>

        {loading && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-gray-600">Searching for available sessions...</p>
          </div>
        )}

        {availableSessions && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Times on {availableSessions.date}
            </h2>
            
            {availableSessions.hours && availableSessions.hours.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {availableSessions.hours.map((hour, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-400 rounded-xl p-4 text-center hover:shadow-lg transform hover:scale-105 transition cursor-pointer"
                  >
                    <div className="text-2xl font-bold text-green-700">{hour}</div>
                    <p className="text-xs text-green-600 mt-2">Available</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <div className="text-3xl mb-2">😔</div>
                <p className="text-gray-600">No available sessions for this date</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-3">📅 How It Works</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Select a date to see available time slots</li>
          <li>• Green boxes show available session times</li>
          <li>• Book a session from your preferred time</li>
          <li>• Sessions are typically 1 hour long</li>
        </ul>
      </div>
    </div>
  )
}
