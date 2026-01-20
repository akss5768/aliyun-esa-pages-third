import { useState, useEffect } from 'react'
import { Calendar, Tag, FileText, DollarSign, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import data from '../data/invoices.json'

function Home() {
  const [invoices, setInvoices] = useState([])
  const [filter, setFilter] = useState("全部")

  useEffect(() => {
    const saved = localStorage.getItem('u-invoices-data')
    if (saved) {
      setInvoices(JSON.parse(saved))
    } else {
      setInvoices(data.initialInvoices)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-invoices-data', JSON.stringify(invoices))
  }, [invoices])

  const getCategoryColor = (category) => {
    const colors = {
      '已支付': 'bg-green-100 text-green-700',
      '待支付': 'bg-yellow-100 text-yellow-700',
      '已逾期': 'bg-red-100 text-red-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case '已支付': return <CheckCircle className="w-5 h-5" />
      case '待支付': return <Clock className="w-5 h-5" />
      case '已逾期': return <AlertCircle className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const filteredInvoices = filter === '全部' ? invoices : invoices.filter(i => i.category === filter)

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">发票管理</h1>
        <p className="text-gray-600">管理您的发票记录</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-md p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 mb-2">总金额</p>
            <p className="text-4xl font-bold flex items-center gap-2">
              <DollarSign className="w-8 h-8" />
              ¥{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 mb-1">发票数量</p>
            <p className="text-2xl font-bold">{filteredInvoices.length} 张</p>
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
              className={`px-4 py-2 rounded-lg transition ${filter === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(invoice.category).split(' ')[0]}`}>
                  {getCategoryIcon(invoice.category)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{invoice.client}</h3>
                  <p className="text-sm text-gray-500">{invoice.number}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(invoice.category)}`}>
                {invoice.category}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">金额</p>
              <p className="text-3xl font-bold text-gray-800">¥{invoice.amount.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">开票日期</p>
                <p className="text-gray-700">{invoice.date}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">到期日期</p>
                <p className="text-gray-700">{invoice.dueDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无发票</p>
        </div>
      )}
    </div>
  )
}

export default Home
