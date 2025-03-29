'use client'
import { HexColorPicker } from 'react-colorful'
import { usePdfAnnotations } from '@/hooks/usePdfAnnotations'
import { useState } from 'react'

export default function AnnotationTools({ activeTool, setActiveTool, 
  activeColor,
  setActiveColor, setShowSignaturePad, setShowComments }) {
  const { setSelectedText, setSelectionPosition } = usePdfAnnotations() 
  const [showColorPicker, setShowColorPicker] = useState(false)

  const tools = [
    { id: 'highlight', label: 'Highlight', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ) },
    { id: 'underline', label: 'Underline', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    ) },
    { id: 'comment', label: 'Comment', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ) },
    { id: 'signature', label: 'Signature', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ) },
  ]

  const handleToolClick = (toolId) => {
    if (toolId === 'signature') {
      setShowSignaturePad(true)
      setActiveTool(null)
      setSelectedText(null)
      setSelectionPosition(null)
    } else if (toolId === 'comment') {
      setShowComments(true)
      setActiveTool(null)
      setSelectedText(null)
      setSelectionPosition(null)
    } else {
      setActiveTool(activeTool === toolId ? null : toolId)
      setSelectedText(null)
      setSelectionPosition(null)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`p-2 rounded-md transition-all duration-200 ${activeTool === tool.id ? 
              'bg-blue-600 text-white shadow-md' : 
              'text-gray-700 hover:bg-gray-200 hover:text-gray-900'}`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded-md transition-all duration-200 hover:bg-gray-200"
          title="Color Picker"
        >
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm" style={{ backgroundColor: activeColor }} />
        </button>
      </div>

      {showColorPicker && (
        <div className="absolute z-20 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
          <HexColorPicker color={activeColor} onChange={setActiveColor} />
          <div className="mt-2 text-center text-sm font-medium text-gray-700">
            {activeColor}
            <div className="mt-1 text-xs text-gray-500">Click to copy</div>
          </div>
        </div>
      )}
    </div>
  )
}