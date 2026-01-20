import { useState, useEffect } from 'react'
import { Calendar, Tag, ExternalLink, Bookmark } from 'lucide-react'
import data from '../data/bookmarks.json'

function Home() {
  const [bookmarks, setBookmarks] = useState([])
  const [filter, setFilter] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem('u-links-data')
    if (saved) {
      setBookmarks(JSON.parse(saved))
    } else {
      setBookmarks(data.initialBookmarks)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-links-data', JSON.stringify(bookmarks))
  }, [bookmarks])

  const getCategoryColor = (category) => {
    const colors = {
      '工作': 'bg-blue-100 text-blue-700',
      '学习': 'bg-green-100 text-green-700',
      '娱乐': 'bg-purple-100 text-purple-700',
      '其他': 'bg-gray-100 text-gray-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const filteredBookmarks = bookmarks
    .filter(bm => filter === '全部' || bm.category === filter)
    .filter(bm =>
      bm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bm.url.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">书签管理</h1>
        <p className="text-gray-600">管理您的网络书签</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索书签..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${filter === cat ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookmarks.map((bookmark) => (
          <a
            key={bookmark.id}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition block group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition">
                  {bookmark.name}
                </h3>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition" />
            </div>
            <p className="text-sm text-gray-500 mb-3 truncate">{bookmark.url}</p>
            <div>
              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(bookmark.category)}`}>
                {bookmark.category}
              </span>
            </div>
          </a>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无书签</p>
        </div>
      )}
    </div>
  )
}

export default Home
