'use client'
import { useState } from 'react'
import Draggable from 'react-draggable'
import { usePdfAnnotations } from '@/hooks/usePdfAnnotations'

export default function CommentsPanel({ onClose }) {
  const [comment, setComment] = useState('')
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const { addComment } = usePdfAnnotations()

  const handleSave = () => {
    if (!comment.trim()) {
      alert('Please enter a comment')
      return
    }
    
    addComment(comment, position)
    setComment('')
    onClose()
  }

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Add Comment</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-blue-100 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Type your comment here..."
            />
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Position on document:</h4>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="relative h-32 w-full bg-white border border-gray-300 rounded">
                <Draggable onDrag={handleDrag}>
                  <div className="absolute cursor-move bg-yellow-50 border border-yellow-200 rounded p-2 shadow-sm max-w-xs">
                    {comment ? (
                      <p className="text-sm text-gray-800">{comment}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Comment preview</p>
                    )}
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 transform rotate-45 bg-yellow-50 border-b border-l border-yellow-200"></div>
                  </div>
                </Draggable>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!comment.trim()}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
                comment.trim() ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}