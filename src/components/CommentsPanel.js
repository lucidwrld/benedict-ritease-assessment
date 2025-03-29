'use client'
import { useState } from 'react'
import Draggable from 'react-draggable' 

export default function CommentsPanel({ onClose, currentPageNumber, addComment, pdfDimensions = { width: 500, height: 700 } }) {
  const [comment, setComment] = useState('')
  const [position, setPosition] = useState({ x: 50, y: 50 }) // Start centered in small preview
  const [commentSize, setCommentSize] = useState({ width: 150, height: 80 }) // Default comment size
  
  // Fixed small preview dimensions
  const previewWidth = 300; // Smaller fixed width
  const previewHeight = 200; // Smaller fixed height

  const handleSave = () => {
    if (!comment.trim()) {
      alert('Please enter a comment')
      return
    }
    
    // Scale the position and size from preview to actual PDF dimensions
    const scaleX = pdfDimensions.width / previewWidth;
    const scaleY = pdfDimensions.height / previewHeight;
    
    const scaledPosition = {
      x: position.x * scaleX,
      y: position.y * scaleY
    };
    
    const scaledSize = {
      width: commentSize.width * scaleX,
      height: commentSize.height * scaleY
    };
    
    addComment(comment, scaledPosition, currentPageNumber, scaledSize)
    setComment('')
    onClose()
  }

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y })
  }

  const handleResize = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = commentSize.width
    const startHeight = commentSize.height
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      setCommentSize({
        width: Math.max(100, startWidth + deltaX),
        height: Math.max(50, startHeight + deltaY)
      })
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
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
            <h4 className="text-sm font-medium text-gray-700 mb-2">Position and size on document:</h4>
            <div className="flex flex-col items-center">
              <div 
                className="relative bg-white border border-gray-300 rounded overflow-hidden"
                style={{
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`,
                  backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Draggable 
                  onDrag={handleDrag}
                  bounds="parent"
                >
                  <div 
                    className="absolute cursor-move bg-yellow-50 border border-yellow-300 shadow-sm p-2"
                    style={{
                      width: `${commentSize.width}px`,
                      height: `${commentSize.height}px`,
                      minWidth: '100px',
                      minHeight: '50px'
                    }}
                  >
                    {comment ? (
                      <p className="text-sm text-gray-800 break-words h-full overflow-auto">{comment}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic h-full flex items-center justify-center">Comment preview</p>
                    )}
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 transform rotate-45 bg-yellow-50 border-b border-l border-yellow-300"></div>
                    <div 
                      className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-blue-500 rounded-tl-sm"
                      onMouseDown={handleResize}
                    />
                  </div>
                </Draggable>
              </div>
              <div className="mt-2 flex justify-between w-full text-xs text-gray-500">
                <div>Preview: {previewWidth}×{previewHeight}px</div>
                <div>Comment: {commentSize.width}×{commentSize.height}px</div>
                <div>Position: {Math.round(position.x)}, {Math.round(position.y)}</div>
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