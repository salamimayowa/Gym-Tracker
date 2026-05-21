import { useState, useEffect } from 'react'
import { sessionAPI } from '../api'

export default function ViewSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTime, setEditTime] = useState('')

  const loadSessions = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await sessionAPI.view()
      setSessions(response.data.sessions || [])
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return
    
    try {
      await sessionAPI.delete({ sessionId })
      setSessions(sessions.filter(s => s.id !== sessionId))
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Failed to delete session')
    }
  }

  const handleEditSubmit = async (sessionId) => {
    if (!editTime) return
    
    try {
      const formattedDateTime = editTime + ':00'
      await sessionAPI.edit({ 
        sessionId, 
        startTime: formattedDateTime 
      })
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, startTime: editTime } : s
      ))
      setEditingId(null)
    } catch (err) {
      setError(err.response?.data?.responseMessage || 'Failed to edit session')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <span className="text-5xl">📋</span>
            <span>Your Sessions</span>
          </h1>
        </div>
        <button
          onClick={loadSessions}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-gray-600">Loading your sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-600 font-semibold mb-4">No sessions yet</p>
          <p className="text-gray-500">Start by booking your first session!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map(session => (
            <div
              key={session.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm text-gray-500">Session ID</p>
                  <p className="font-mono text-gray-700">{session.id}</p>
                </div>
                <div className="flex space-x-2">
                  {editingId !== session.id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(session.id)
                          setEditTime(session.startTime?.substring(0, 16) || '')
                        }}
                        className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === session.id ? (
                <div className="space-y-3">
                  <input
                    type="datetime-local"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSubmit(session.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Start Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {session.startTime ? new Date(session.startTime).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}

              {session.status && (
                <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  ✓ {session.status}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
