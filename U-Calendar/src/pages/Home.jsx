import { useState, useEffect } from 'react'
import { Calendar, Tag, Clock } from 'lucide-react'
import data from '../data/events.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")

  useEffect(() => {
    const saved = localStorage.getItem('u-calendar-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.events)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-calendar-data', JSON.stringify(items))
  }, [items])

  const filteredItems = filter === '全部' || filter === '' ? items : items.filter(item => item.category === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">日历日程</h1>
        <p className="text-gray-600">管理您的日程安排</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${filter === cat ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
              <Calendar className="w-5 h-5 text-cyan-600" />
              <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span>{item.date} {item.time}</span>
            </div>
            <p className="text-gray-600 mb-3">{item.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="text-xs px-2 py-1 rounded bg-cyan-100 text-cyan-700">
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
