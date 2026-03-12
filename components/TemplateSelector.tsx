'use client'

import { useState } from 'react'
import { Palette, Check } from 'lucide-react'

export type TemplateType = 'classic' | 'modern' | 'minimal'

interface TemplateSelectorProps {
  value: TemplateType
  onChange: (template: TemplateType) => void
}

const templates = [
  {
    id: 'classic' as TemplateType,
    name: '经典雅致',
    description: '传统中式风格，适合商务宴请',
    colors: ['#1A1A1A', '#C9A962', '#FAF7F2']
  },
  {
    id: 'modern' as TemplateType,
    name: '现代简约',
    description: '简洁大方，适合私人聚会',
    colors: ['#2C3E50', '#E74C3C', '#ECF0F1']
  },
  {
    id: 'minimal' as TemplateType,
    name: '极简留白',
    description: '大量留白，艺术品位',
    colors: ['#000000', '#FFFFFF', '#F5F5F5']
  }
]

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur text-white rounded-lg hover:bg-white/20 transition-colors"
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm">切换风格</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E5E0D8] z-50 overflow-hidden">
            <div className="p-4 border-b border-[#E5E0D8]">
              <h3 className="font-medium text-[#1A1A1A]">选择邀请函风格</h3>
            </div>
            <div className="p-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onChange(template.id)
                    setIsOpen(false)
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    value === template.id
                      ? 'bg-[#F5F0E8] ring-2 ring-[#C9A962]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex gap-1">
                      {template.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-[#1A1A1A]">
                          {template.name}
                        </span>
                        {value === template.id && (
                          <Check className="w-4 h-4 text-[#C9A962]" />
                        )}
                      </div>
                      <p className="text-xs text-[#8A8A8A] mt-0.5">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
