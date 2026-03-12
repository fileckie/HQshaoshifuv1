'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* 顶部细红线 */}
      <div className="h-1 bg-[#c41e3a]"></div>
      
      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-20">
        {/* Logo区域 */}
        <div className="text-center mb-16">
          {/* 书法Logo */}
          <h1 className="text-8xl md:text-9xl text-white mb-8 tracking-widest" style={{ fontFamily: 'serif', fontWeight: 700 }}>
            烧师富
          </h1>
          
          {/* 红圈圈修饰 板前创作烧鸟 */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 border border-[#c41e3a] rounded-full flex items-center justify-center">
              <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>板</span>
            </div>
            <div className="w-10 h-10 border border-[#c41e3a] rounded-full flex items-center justify-center">
              <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>前</span>
            </div>
            <div className="w-10 h-10 border border-[#c41e3a] rounded-full flex items-center justify-center">
              <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>创</span>
            </div>
            <div className="w-10 h-10 border border-[#c41e3a] rounded-full flex items-center justify-center">
              <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>作</span>
            </div>
            <div className="w-10 h-10 border border-[#c41e3a] rounded-full flex items-center justify-center">
              <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>烧</span>
            </div>
            <div className="w-10 h-10 border border-[#c41e3a] rounded-full flex items-center justify-center">
              <span className="text-[#c41e3a] text-xs" style={{ fontFamily: 'serif' }}>鸟</span>
            </div>
          </div>
          
          {/* 品类表达 */}
          <div className="mb-6">
            <p className="text-2xl md:text-3xl text-white tracking-[0.2em]" style={{ fontFamily: 'serif', fontWeight: 500 }}>
              板前创作烧鸟
            </p>
          </div>
          
          {/* 氛围文字 - 来自品牌内容 */}
          <p className="text-white/50 text-base tracking-wider" style={{ fontFamily: 'serif' }}>
            "让烧鸟重新变成一种可以创作的料理"
          </p>
        </div>

        {/* CTA按钮 */}
        <Link 
          href="/admin"
          className="px-16 py-5 border border-white/40 text-white text-base tracking-[0.2em] hover:bg-white hover:text-black transition-colors mb-16"
          style={{ fontFamily: 'serif' }}
        >
          预约席位
        </Link>

        {/* 地址信息 */}
        <div className="text-center space-y-3 text-sm text-white/40 tracking-wider" style={{ fontFamily: 'serif' }}>
          <p>双塔街道竹辉路168号环宇荟·L133</p>
          <p className="text-white/60">177 1554 9313</p>
        </div>
      </div>

      {/* 底部 */}
      <div className="py-6 text-center border-t border-white/5">
        <p className="text-sm text-white/20 tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
          厨师站在炭火前，根据食材的状态进行组合
        </p>
      </div>
    </main>
  )
}
