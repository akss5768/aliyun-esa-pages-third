import { useState, useEffect } from 'react'
import { Calendar, Tag, Flame, CheckCircle } from 'lucide-react'
import data from '../data/habits.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")

  useEffect(() => {
    const saved = localStorage.getItem('u-habits-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.initialHabits)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-habits-data', JSON.stringify(items))
  }, [items])

  const filteredItems = filter === '全部' || filter === '' ? items : items.filter(item => item.category === filter)

  const toggleHabit = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completedToday: !item.completedToday } : item
    ))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">习惯追踪</h1>
        <p className="text-gray-600">培养和追踪好习惯</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${filter === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div key={item.id || index} className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition ${item.completedToday ? 'border-2 border-green-500' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
              <button
                onClick={() => toggleHabit(item.id)}
                className={`p-2 rounded-full ${item.completedToday ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
              >
                <CheckCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">连续 {item.streak} 天</span>
            </div>
            <p className="text-gray-600 mb-3">目标: {item.target}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                {item.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${item.completedToday ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {item.completedToday ? '已完成' : '未完成'}
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
