import { useState, useEffect } from 'react'
import { Calendar, Tag, File, Download, Folder, Plus, Edit2, Trash2, X } from 'lucide-react'
import data from '../data/files.json'

function Home() {
  const [files, setFiles] = useState([])
  const [filter, setFilter] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    type: 'PDF',
    category: '文档',
    date: new Date().toISOString().split('T')[0]
  })

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

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      size: '',
      type: 'PDF',
      category: '文档',
      date: new Date().toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      size: item.size,
      type: item.type,
      category: item.category,
      date: item.date
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个文件吗?')) {
      setFiles(files.filter(file => file.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      setFiles(files.map(file => 
        file.id === editingItem.id 
          ? { ...file, ...formData }
          : file
      ))
    } else {
      const newId = Math.max(...files.map(f => f.id), 0) + 1
      setFiles([...files, { ...formData, id: newId }])
    }
    setShowModal(false)
    setEditingItem(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">文件管理</h1>
          <p className="text-gray-600">管理您的文件资料</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          <Plus className="w-5 h-5" />
          添加文件
        </button>
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
              <div className="flex gap-2">
                <button onClick={() => handleEdit(file)} className="text-gray-500 hover:text-gray-700">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(file.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? '编辑文件' : '添加文件'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文件名</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="请输入文件名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">大小</label>
                <input
                  type="text"
                  required
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="请输入文件大小"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Word">Word</option>
                    <option value="Excel">Excel</option>
                    <option value="JPEG">JPEG</option>
                    <option value="PNG">PNG</option>
                    <option value="MP4">MP4</option>
                    <option value="MP3">MP3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    {data.categories.filter(c => c !== '全部').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  {editingItem ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
