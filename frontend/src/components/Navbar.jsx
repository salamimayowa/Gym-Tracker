import { useState } from 'react'

export default function Navbar({ user, onLogout, onNavigate }) {
  const [showMenu, setShowMenu] = useState(false)

  const navItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'sessions', label: '📅 Sessions', icon: '📅' },
    { id: 'book', label: '✍️ Book Session', icon: '✍️' },
    { id: 'workouts', label: '💪 Workouts', icon: '💪' },
    { id: 'available', label: '🕐 Available', icon: '🕐' },
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💪</span>
            <span className="font-bold text-xl hidden sm:inline">Gym Tracker</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setShowMenu(false)
                }}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 hover:bg-opacity-50 transition"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold">{user?.email || 'User'}</p>
              <p className="text-xs text-blue-100">{user?.role || 'USER'}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden text-2xl"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setShowMenu(false)
                }}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-blue-700 hover:bg-opacity-50 transition text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
