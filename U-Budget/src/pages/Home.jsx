import { useState, useEffect } from 'react'
import { Search, Calendar, Tag } from 'lucide-react'
import data from '../data/budget.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("餐饮")

  useEffect(() => {
    const saved = localStorage.getItem('ubudget-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.initialBudget if 'initial' in data else data.budget)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ubudget-data', JSON.stringify(items))
  }, [items])

  const filteredItems = filter === '全部' || filter === '' ? items : items.filter(item => item.category === filter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">个人财务管理</h1>
        <p className="text-gray-600">轻松管理您的收支情况</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6"><div className="flex flex-wrap gap-2"><Tag className="w-5 h-5 text-gray-500" />
      {project_info["categories"].map(cat => (}<button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg transition ${filter === cat ? `bg-blue-600 text-white` : `bg-gray-100 text-gray-700 hover:bg-gray-200`}`}>{cat}</button>))}
      </div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div key={item.id || index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title || item.name}</h3>
            <p className="text-gray-600 mb-4">{JSON.stringify(item).replace(/["{}:]/g, " ")[:100]}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
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