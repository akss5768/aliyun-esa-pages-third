import { Wallet } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">U-Budget</span>
          </div>
          <div className="text-gray-600">
            轻松管理您的收支情况
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar