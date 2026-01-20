import { CheckCircle } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">U-Habits</span>
          </div>
          <div className="text-gray-600">
            培养和追踪好习惯
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar