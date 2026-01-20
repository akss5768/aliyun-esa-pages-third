import { useState, useEffect } from 'react'
import { Calendar, Tag, File, Download, Folder } from 'lucide-react'
import data from '../data/files.json'

function Home() {
  const [files, setFiles] = useState([])
  const [filter, setFilter] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem('u-files-data')
    if (saved) {
      setFiles(JSON.parse(saved))
    } else {
      setFiles(data.initialFiles)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-files-data', JSON.stringify(files))
  }, [files])

  const getFileIcon = (type) => {
    const icons = {
      'PDF': '📄',
      'Word': '📝',
      'Excel': '📊',
      'JPEG': '🖼️',
      'PNG': '🖼️',
      'MP4': '🎬',
      'MP3': '🎵'
    }
    return icons[type] || '📁'
  }

  const getCategoryColor = (category) => {
    const colors = {
      '文档': 'bg-blue-100 text-blue-700',
      '图片': 'bg-purple-100 text-purple-700',
      '视频': 'bg-red-100 text-red-700',
      '其他': 'bg-gray-100 text-gray-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const filteredFiles = files
    .filter(file => filter === '全部' || file.category === filter)
    .filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">文件管理</h1>
        <p className="text-gray-600">管理您的文件资料</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索文件..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${filter === cat ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{getFileIcon(file.type)}</div>
              <button className="text-gray-500 hover:text-gray-700">
                <Download className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{file.name}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>类型</span>
                <span className="font-medium">{file.type}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>大小</span>
                <span className="font-medium">{file.size}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>日期</span>
                <span className="font-medium">{file.date}</span>
              </div>
            </div>
            <div className="mt-3">
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(file.category)}`}>
                {file.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无文件</p>
        </div>
      )}
    </div>
  )
}

export default Home
