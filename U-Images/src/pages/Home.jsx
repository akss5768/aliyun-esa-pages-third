import { useState, useEffect } from 'react'
import { Calendar, Tag, Image as ImageIcon, Heart, ZoomIn } from 'lucide-react'
import data from '../data/images.json'

function Home() {
  const [images, setImages] = useState([])
  const [filter, setFilter] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")
  const [likedImages, setLikedImages] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('u-images-data')
    if (saved) {
      setImages(JSON.parse(saved))
    } else {
      setImages(data.initialImages)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('u-images-data', JSON.stringify(images))
  }, [images])

  const toggleLike = (id) => {
    setLikedImages(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getCategoryColor = (category) => {
    const colors = {
      '风景': 'bg-blue-100 text-blue-700',
      '人物': 'bg-pink-100 text-pink-700',
      '建筑': 'bg-orange-100 text-orange-700',
      '艺术': 'bg-purple-100 text-purple-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const filteredImages = images
    .filter(img => filter === '全部' || img.category === filter)
    .filter(img =>
      img.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">图片画廊</h1>
        <p className="text-gray-600">展示您的图片作品</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索图片..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          {data.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg transition ${filter === cat ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
            <div className="relative aspect-video bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-pink-300" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => toggleLike(image.id)}
                  className={`p-2 rounded-full ${likedImages[image.id] ? 'bg-red-500 text-white' : 'bg-white text-gray-500'} shadow-md`}
                >
                  <Heart className={`w-5 h-5 ${likedImages[image.id] ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{image.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{image.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(image.category)}`}>
                  {image.category}
                </span>
                <span className="text-xs text-gray-500">{image.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>暂无图片</p>
        </div>
      )}
    </div>
  )
}

export default Home
