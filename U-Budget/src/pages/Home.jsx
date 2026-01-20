import { useState, useEffect } from 'react'
import { Search, Calendar, Tag, Plus, Edit2, Trash2, X, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'
import data from '../data/budget.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '餐饮',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const saved = localStorage.getItem('ubudget-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.initialTransactions)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ubudget-data', JSON.stringify(items))
  }, [items])

  const filteredItems = filter === '全部' || filter === '' ? items : items.filter(item => item.category === filter)

  const totalIncome = items.filter(i => i.type === 'income').reduce((sum, i) => sum + i.amount, 0)
  const totalExpense = items.filter(i => i.type === 'expense').reduce((sum, i) => sum + i.amount, 0)
  const balance = totalIncome - totalExpense

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '餐饮',
      date: new Date().toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      description: item.description,
      amount: item.amount,
      type: item.type,
      category: item.category,
      date: item.date
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这条记录吗?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(formData.amount)
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, amount }
          : item
      ))
    } else {
      const newId = Math.max(...items.map(i => i.id), 0) + 1
      setItems([...items, { ...formData, amount, id: newId }])
    }
    setShowModal(false)
    setEditingItem(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">个人财务管理</h1>
          <p className="text-gray-600">轻松管理您的收支情况</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          添加记录
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUp className="w-6 h-6" />
            <span className="text-sm font-medium">总收入</span>
          </div>
          <p className="text-3xl font-bold">¥{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <ArrowDown className="w-6 h-6" />
            <span className="text-sm font-medium">总支出</span>
          </div>
          <p className="text-3xl font-bold">¥{totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6" />
            <span className="text-sm font-medium">余额</span>
          </div>
          <p className="text-3xl font-bold">¥{balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          <button key="全部" onClick={() => setFilter('全部')} className={`px-4 py-2 rounded-lg transition ${filter === '全部' ? `bg-blue-600 text-white` : `bg-gray-100 text-gray-700 hover:bg-gray-200`}`}>全部</button>
          {data.categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg transition ${filter === cat ? `bg-blue-600 text-white` : `bg-gray-100 text-gray-700 hover:bg-gray-200`}`}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div key={item.id || index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {item.type === 'income' ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{item.description}</h3>
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
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className={`text-lg font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()}元
                </p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? '编辑记录' : '添加记录'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入金额"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="income">收入</option>
                    <option value="expense">支出</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {data.categories.map(cat => (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
