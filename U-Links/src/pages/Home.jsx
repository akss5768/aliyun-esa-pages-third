import { useState, useEffect } from 'react'
import { Calendar, Tag, Plus, Edit2, Trash2, X, Link, ExternalLink, Search } from 'lucide-react'
import data from '../data/bookmarks.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '工作'
  })

  useEffect(() => {
    const saved = localStorage.getItem('u-links-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.initialBookmarks)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-links-data', JSON.stringify(items))
  }, [items])

  const filteredItems = items
    .filter(item => filter === '全部' || item.category === filter)
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      url: '',
      category: '工作'
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      url: item.url,
      category: item.category
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这个书签吗?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ))
    } else {
      const newId = Math.max(...items.map(i => i.id), 0) + 1
      setItems([...items, { ...formData, id: newId }])
    }
    setShowModal(false)
    setEditingItem(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">书签管理</h1>
          <p className="text-gray-600">管理您的书签收藏</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          <Plus className="w-5 h-5" />
          添加书签
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索书签..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === cat ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div key={item.id || index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 hover:bg-red-100 rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <a 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 mb-3 block hover:text-orange-600 transition truncate"
            >
              {item.url}
            </a>
            <div className="flex items-center justify-between">
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                访问链接
              </a>
              <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Link className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无书签</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? '编辑书签' : '添加书签'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="请输入书签名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="请输入URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {data.categories.filter(c => c !== '全部').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
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
