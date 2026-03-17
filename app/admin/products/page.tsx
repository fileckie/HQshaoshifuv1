'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react'

interface Product {
  id?: string
  name: string
  description: string
  category: string
  sortOrder: number
  isActive: boolean
}

const CATEGORIES = [
  { value: '主厨限定串', label: '主厨限定串' },
  { value: '当季时令烧鸟', label: '当季时令烧鸟' },
  { value: '其他', label: '其他' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 加载产品列表
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?isActive=true')
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
      } else {
        // 默认数据
        setProducts([
          { name: '主厨限定串', description: '主厨当日精选部位创作', category: '主厨限定串', sortOrder: 0, isActive: true },
          { name: '当季时令烧鸟', description: '根据当日食材新鲜度呈现', category: '当季时令烧鸟', sortOrder: 1, isActive: true },
        ])
      }
    } catch (error) {
      console.error('Error:', error)
      // 默认数据
      setProducts([
        { name: '主厨限定串', description: '主厨当日精选部位创作', category: '主厨限定串', sortOrder: 0, isActive: true },
        { name: '当季时令烧鸟', description: '根据当日食材新鲜度呈现', category: '当季时令烧鸟', sortOrder: 1, isActive: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  // 添加新产品
  const addProduct = () => {
    setProducts([...products, {
      name: '',
      description: '',
      category: '其他',
      sortOrder: products.length,
      isActive: true,
    }])
  }

  // 删除产品
  const removeProduct = async (index: number, id?: string) => {
    if (id) {
      // 删除数据库中的
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' })
      } catch (error) {
        console.error('Error deleting:', error)
      }
    }
    // 从列表中移除
    const newProducts = products.filter((_, i) => i !== index)
    // 重新排序
    setProducts(newProducts.map((p, i) => ({ ...p, sortOrder: i })))
  }

  // 更新产品
  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const newProducts = [...products]
    newProducts[index] = { ...newProducts[index], [field]: value }
    setProducts(newProducts)
  }

  // 保存所有产品
  const saveProducts = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      })
      
      if (res.ok) {
        alert('保存成功！')
        fetchProducts()
      } else {
        alert('保存失败，请重试')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        加载中...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: 'serif' }}>返回管理后台</span>
          </Link>
          <h1 className="text-2xl text-white" style={{ fontFamily: 'serif' }}>
            今日推荐产品管理
          </h1>
        </div>

        {/* 说明 */}
        <div className="mb-6 p-4 border border-white/10 bg-white/5">
          <p className="text-white/60 text-sm" style={{ fontFamily: 'serif' }}>
            管理邀约卡上「今日推荐」栏目显示的产品。产品名称会居中显示，介绍文字会缩小显示在产品名称下方。
          </p>
        </div>

        {/* 产品列表 */}
        <div className="space-y-4 mb-8">
          {products.map((product, index) => (
            <div 
              key={product.id || index} 
              className="p-4 border border-white/10 bg-white/5"
            >
              <div className="flex items-start gap-3">
                <div className="pt-2 text-white/20">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 space-y-4">
                  {/* 产品名称 */}
                  <div>
                    <label className="block text-white/40 text-xs mb-1" style={{ fontFamily: 'serif' }}>
                      产品名称
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateProduct(index, 'name', e.target.value)}
                      placeholder="如：主厨限定串"
                      className="w-full bg-transparent border-b border-white/20 focus:border-white px-0 py-2 text-white outline-none"
                      style={{ fontFamily: 'serif' }}
                    />
                  </div>

                  {/* 产品介绍（小字） */}
                  <div>
                    <label className="block text-white/40 text-xs mb-1" style={{ fontFamily: 'serif' }}>
                      产品介绍（显示在产品名称下方的小字）
                    </label>
                    <input
                      type="text"
                      value={product.description}
                      onChange={(e) => updateProduct(index, 'description', e.target.value)}
                      placeholder="如：主厨当日精选部位创作"
                      className="w-full bg-transparent border-b border-white/20 focus:border-white px-0 py-2 text-white outline-none text-sm"
                      style={{ fontFamily: 'serif' }}
                    />
                  </div>

                  {/* 类别 */}
                  <div>
                    <label className="block text-white/40 text-xs mb-2" style={{ fontFamily: 'serif' }}>
                      类别
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => updateProduct(index, 'category', cat.value)}
                          className={`px-3 py-1 text-xs border ${
                            product.category === cat.value
                              ? 'bg-white border-white text-black'
                              : 'border-white/20 text-white/60 hover:border-white/40'
                          }`}
                          style={{ fontFamily: 'serif' }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => removeProduct(index, product.id)}
                  className="p-2 text-white/30 hover:text-[#c41e3a] transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 添加按钮 */}
        <button
          onClick={addProduct}
          className="w-full py-3 border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 flex items-center justify-center gap-2 mb-8"
          style={{ fontFamily: 'serif' }}
        >
          <Plus className="w-5 h-5" />
          添加产品
        </button>

        {/* 保存按钮 */}
        <button
          onClick={saveProducts}
          disabled={saving}
          className="w-full py-4 bg-white text-black text-lg tracking-widest hover:bg-white/90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ fontFamily: 'serif' }}
        >
          <Save className="w-5 h-5" />
          {saving ? '保存中...' : '保存设置'}
        </button>

        {/* 预览提示 */}
        <div className="mt-8 text-center">
          <p className="text-white/30 text-xs" style={{ fontFamily: 'serif' }}>
            保存后，新创建的邀约卡将显示最新的产品设置
          </p>
        </div>
      </div>
    </div>
  )
}
