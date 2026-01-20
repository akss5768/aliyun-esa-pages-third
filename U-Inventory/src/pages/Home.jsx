import { useState, useEffect } from 'react'
import { Calendar, Tag, Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import data from '../data/inventory.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")

  useEffect(() => {
    const saved = localStorage.getItem('u-inventory-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.initialItems)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-inventory-data', JSON.stringify(items))
  }, [items])

  const getCategoryColor = (category) => {
    const colors = {
      '电子产品': 'bg-blue-100 text-blue-700',
      '服装': 'bg-pink-100 text-pink-700',
      '食品': 'bg-green-100 text-green-700',
      '其他': 'bg-gray-100 text-gray-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const filteredItems = filter === '全部' ? items : items.filter(i => i.category === filter)

  const lowStockItems = items.filter(item => item.quantity <= item.minStock)
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">库存管理</h1>
        <p className="text-gray-600">管理您的库存商品</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-lime-500 to-lime-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lime-100 mb-2">商品总数</p>
              <p className="text-3xl font-bold">{items.length}</p>
            </div>
            <Package className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 mb-2">低库存预警</p>
              <p className="text-3xl font-bold">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">库存总值</p>
              <p className="text-3xl font-bold">¥{totalValue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${filter === cat ? 'bg-lime-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-lime-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.sku}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">库存</span>
                <div className="flex items-center gap-2">
                  {item.quantity <= item.minStock ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`font-bold ${item.quantity <= item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                    {item.quantity}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">单价</span>
                <span className="font-bold text-gray-800">¥{item.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">最低库存</span>
                <span className="font-bold text-gray-600">{item.minStock}</span>
              </div>
            </div>

            <div className="mt-3">
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无商品</p>
        </div>
      )}
    </div>
  )
}

export default Home
