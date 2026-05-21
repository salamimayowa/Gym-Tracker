import { useState } from 'react'
import { workoutAPI } from '../api'

export default function CreateWorkout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    exerciseName: '',
    targetReps: '',
    sets: '',
    workoutDate: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await workoutAPI.create({
        exerciseName: formData.exerciseName,
        targetReps: parseInt(formData.targetReps, 10),
        sets: parseInt(formData.sets, 10),
        workoutDate: formData.workoutDate
      })

      if (response.data.responseCode === '00') {
        setSuccess('Workout created successfully! 🎉')
        setFormData({ exerciseName: '', targetReps: '', sets: '', workoutDate: '' })
      } else {
        setError(response.data.responseMessage || 'Failed to create workout')
      }
    } catch (err) {
      setError(err.response?.data?.responseMessage || err.message || 'Failed to create workout')
    } finally {
      setLoading(false)
    }
  }

  const commonExercises = ['Bench Press', 'Squats', 'Deadlift', 'Pull-ups', 'Push-ups', 'Dumbbell Rows', 'Leg Press', 'Cardio']

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-5xl">💪</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Workout</h1>
            <p className="text-gray-500 mt-1">Log your exercise and track progress</p>
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
          {/* Exercise Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Exercise Name
            </label>
            <div className="space-y-3">
              <input
                type="text"
                name="exerciseName"
                value={formData.exerciseName}
                onChange={handleChange}
                required
                placeholder="e.g., Bench Press"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commonExercises.map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, exerciseName: ex }))}
                    className="px-3 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-lg text-sm font-medium transition"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Reps & Sets */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Target Reps
              </label>
              <input
                type="number"
                name="targetReps"
                value={formData.targetReps}
                onChange={handleChange}
                required
                min="1"
                placeholder="10"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sets
              </label>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                required
                min="1"
                placeholder="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Workout Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Workout Date
            </label>
            <input
              type="date"
              name="workoutDate"
              value={formData.workoutDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? '⏳ Creating...' : '✓ Create Workout'}
          </button>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md p-6 border border-purple-200">
        <h3 className="font-bold text-gray-900 mb-3">💡 Workout Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Start with 3 sets of 8-12 reps for strength</li>
          <li>• Rest 60-90 seconds between sets</li>
          <li>• Focus on proper form over heavy weight</li>
          <li>• Track your progress over time</li>
          <li>• Mix cardio and strength training</li>
        </ul>
      </div>
    </div>
  )
}
