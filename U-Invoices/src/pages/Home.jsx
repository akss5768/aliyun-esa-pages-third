import { useState, useEffect } from 'react'
import { Calendar, Tag, Plus, Edit2, Trash2, X, FileText, DollarSign } from 'lucide-react'
import data from '../data/invoices.json'

function Home() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState("全部")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    number: '',
    client: '',
    amount: 0,
    category: '待支付',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  useEffect(() => {
    const saved = localStorage.getItem('u-invoices-data')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(data.initialInvoices)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-invoices-data', JSON.stringify(items))
  }, [items])

  const filteredItems = filter === '全部' || filter === '' ? items : items.filter(item => item.category === filter)

  const totalAmount = filteredItems.reduce((sum, item) => sum + item.amount, 0)

  const getCategoryColor = (category) => {
    const colors = {
      '已支付': 'bg-green-100 text-green-700',
      '待支付': 'bg-yellow-100 text-yellow-700',
      '已逾期': 'bg-red-100 text-red-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      client: '',
      amount: 0,
      category: '待支付',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      number: item.number,
      client: item.client,
      amount: item.amount,
      category: item.category,
      date: item.date,
      dueDate: item.dueDate
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('确定要删除这张发票吗?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const markAsPaid = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, category: '已支付' } : item
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, amount: parseFloat(formData.amount) }
          : item
      ))
    } else {
      const newId = Math.max(...items.map(i => i.id), 0) + 1
      setItems([...items, { ...formData, id: newId, amount: parseFloat(formData.amount) }])
    }
    setShowModal(false)
    setEditingItem(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">发票管理</h1>
          <p className="text-gray-600">管理您的发票记录</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          添加发票
        </button>
      </div>

      {filter !== '全部' && (
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 mb-6 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6" />
            <span className="text-sm font-medium">{filter}总额</span>
          </div>
          <p className="text-3xl font-bold">¥{totalAmount.toLocaleString()}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">{item.number}</h3>
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
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>客户</span>
                <span className="font-medium">{item.client}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>金额</span>
                <span className="font-medium">¥{item.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>开票日期</span>
                <span className="font-medium">{item.date}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>到期日期</span>
                <span className="font-medium">{item.dueDate}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
              {item.category === '待支付' && (
                <button
                  onClick={() => markAsPaid(item.id)}
                  className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  标记已支付
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无发票</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? '编辑发票' : '添加发票'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">发票号</label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="请输入发票号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客户</label>
                <input
                  type="text"
                  required
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="请输入客户名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="请输入金额"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {data.categories.filter(c => c !== '全部').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开票日期</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">到期日期</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
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
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
