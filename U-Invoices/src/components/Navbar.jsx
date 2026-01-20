import { FileText } from 'lucide-react'

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">U-Invoices</span>
          </div>
          <div className="text-gray-600">
            管理您的发票记录
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar