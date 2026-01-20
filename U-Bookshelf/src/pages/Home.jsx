import { useState, useEffect } from 'react'
import { Calendar, Tag, BookOpen, Star } from 'lucide-react'
import data from '../data/books.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">图书管理</h1>
        <p className="text-gray-600">管理您的图书收藏</p>
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
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
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
    </div>
  )
}

export default Home