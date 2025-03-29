'use client'
import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import Draggable from 'react-draggable' 

export default function SignaturePad({ onClose, currentPageNumber, addSignature, pdfDimensions = { width: 500, height: 700 } }) {
  const sigCanvas = useRef(null)
  const [position, setPosition] = useState({ x: 50, y: 50 }) // Start position centered in small preview
  const [isSigning, setIsSigning] = useState(false)
  const [signatureSize, setSignatureSize] = useState({ width: 80, height: 40 }) // Smaller default size
  
  // Fixed small preview dimensions
  const previewWidth = 300; // Smaller fixed width
  const previewHeight = 200; // Smaller fixed height

  const handleSave = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide a signature first')
      return
    }
    
    // Scale the position from preview to actual PDF dimensions
    const scaleX = pdfDimensions.width / previewWidth;
    const scaleY = pdfDimensions.height / previewHeight;
    
    const scaledPosition = {
      x: position.x * scaleX,
      y: position.y * scaleY
    };
    
    const scaledSize = {
      width: signatureSize.width * scaleX,
      height: signatureSize.height * scaleY
    };
    
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
    addSignature(signatureData, scaledPosition, currentPageNumber, scaledSize)
    onClose()
  }

  const handleClear = () => {
    sigCanvas.current.clear()
    setIsSigning(false)
  }

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y })
  }

  const handleBeginSign = () => {
    setIsSigning(true)
  }

  const handleResize = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = signatureSize.width
    const startHeight = signatureSize.height
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      setSignatureSize({
        width: Math.max(40, startWidth + deltaX),
        height: Math.max(20, startHeight + deltaY)
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
      <div className="bg-white rounded-xl max-h-screen shadow-xl w-full max-w-md overflow-auto">
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Add Your Signature</h3>
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
            <h4 className="text-sm font-medium text-gray-700 mb-2">Draw your signature:</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ 
                  width: 300, 
                  height: 150, 
                  className: 'w-full bg-gray-50',
                  style: { cursor: isSigning ? 'crosshair' : 'default' }
                }}
                onBegin={handleBeginSign}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={handleClear}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
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
                    className="absolute cursor-move bg-white border border-blue-300 shadow-sm"
                    style={{
                      width: `${signatureSize.width}px`,
                      height: `${signatureSize.height}px`,
                      minWidth: '40px',
                      minHeight: '20px'
                    }}
                  >
                    {sigCanvas.current && !sigCanvas.current.isEmpty() ? (
                      <img 
                        src={sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')} 
                        alt="Signature Preview" 
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Signature
                      </div>
                    )}
                    <div 
                      className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-blue-500 rounded-tl-sm"
                      onMouseDown={handleResize}
                    />
                  </div>
                </Draggable>
              </div>
              <div className="mt-2 flex justify-between w-full text-xs text-gray-500">
                <div>Preview: {previewWidth}×{previewHeight}px</div>
                <div>Signature: {signatureSize.width}×{signatureSize.height}px</div>
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Save Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}