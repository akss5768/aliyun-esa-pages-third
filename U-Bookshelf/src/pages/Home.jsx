import { useState, useEffect } from 'react'
import { Calendar, Tag, BookOpen, Star, Plus, Edit2, Trash2, X } from 'lucide-react'
import data from '../data/books.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '文学',
    status: '未开始',
    rating: 3
  })

  useEffect(() => {
    const saved = localStorage.getItem('ubookshelf-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.initialBooks)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ubookshelf-data', JSON.stringify(items))
  }, [items])

  const filteredItems = filter === '全部' || filter === '' ? items : items.filter(item => item.category === filter)

  const getStatusColor = (status) => {
    switch (status) {
      case '未开始': return 'bg-gray-100 text-gray-700'
      case '阅读中': return 'bg-blue-100 text-blue-700'
      case '已读完': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      author: '',
      category: '文学',
      status: '未开始',
      rating: 3
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      author: item.author,
      category: item.category,
      status: item.status,
      rating: item.rating
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这本书吗?')) {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">图书管理</h1>
          <p className="text-gray-600">管理您的图书收藏</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          <Plus className="w-5 h-5" />
          添加图书
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === cat ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
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
            <p className="text-gray-600 mb-2">作者: {item.author}</p>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < item.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无数据</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? '编辑图书' : '添加图书'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">书名</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {data.categories.filter(c => c !== '全部').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {data.statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">评分</label>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: i + 1 })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${i < formData.rating ? 'text-amber-500 fill-current' : 'text-gray-300'} hover:text-amber-400`}
                      />
                    </button>
                  ))}
                </div>
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
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
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
