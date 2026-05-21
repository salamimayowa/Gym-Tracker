export default function Home({ user }) {
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-xl text-gray-600">{user?.email}</p>
          <p className="text-gray-500 mt-4">Track your fitness journey and achieve your goals</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sessions" 
          value="12" 
          icon="📅"
          color="from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Workouts" 
          value="28" 
          icon="💪"
          color="from-purple-500 to-purple-600"
        />
        <StatCard 
          title="Current Streak" 
          value="7 days" 
          icon="🔥"
          color="from-red-500 to-red-600"
        />
        <StatCard 
          title="Goals Achieved" 
          value="5/10" 
          icon="🎯"
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          title="📅 Book Sessions"
          description="Schedule your workout sessions with flexible time slots"
          bgColor="from-blue-50 to-blue-100"
        />
        <FeatureCard
          title="💪 Log Workouts"
          description="Track your exercises, sets, and reps to monitor progress"
          bgColor="from-purple-50 to-purple-100"
        />
        <FeatureCard
          title="📊 View History"
          description="Review all your past sessions and workout statistics"
          bgColor="from-green-50 to-green-100"
        />
        <FeatureCard
          title="🕐 Find Available"
          description="Discover available sessions by date"
          bgColor="from-yellow-50 to-yellow-100"
        />
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
        <p className="text-2xl font-bold italic">"The only bad workout is the one that didn't happen" 💯</p>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition`}>
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-white text-opacity-90 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}

function FeatureCard({ title, description, bgColor }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-xl shadow-md p-6 hover:shadow-xl transition`}>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
