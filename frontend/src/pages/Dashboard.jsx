import Home from './Home'
import BookSession from './BookSession'
import ViewSessions from './ViewSessions'
import CreateWorkout from './CreateWorkout'
import AvailableSessions from './AvailableSessions'

export default function Dashboard({ currentPage, setCurrentPage, user }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentPage === 'home' && <Home user={user} />}
      {currentPage === 'sessions' && <ViewSessions />}
      {currentPage === 'book' && <BookSession />}
      {currentPage === 'workouts' && <CreateWorkout />}
      {currentPage === 'available' && <AvailableSessions />}
    </main>
  )
}
