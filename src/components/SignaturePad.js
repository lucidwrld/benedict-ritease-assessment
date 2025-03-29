'use client'
import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import Draggable from 'react-draggable'
import { usePdfAnnotations } from '@/hooks/usePdfAnnotations'

export default function SignaturePad({ onClose }) {
  const sigCanvas = useRef(null)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isSigning, setIsSigning] = useState(false)
  const { addSignature } = usePdfAnnotations()

  const handleSave = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide a signature first')
      return
    }
    
    const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
    addSignature(signatureData, position)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
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
                  width: 500, 
                  height: 200, 
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
            <h4 className="text-sm font-medium text-gray-700 mb-2">Position on document:</h4>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="relative h-32 w-full bg-white border border-gray-300 rounded">
                <Draggable onDrag={handleDrag}>
                  <div className="absolute cursor-move">
                    {sigCanvas.current && !sigCanvas.current.isEmpty() ? (
                      <img 
                        src={sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')} 
                        alt="Signature Preview" 
                        className="max-h-16 object-contain border border-gray-200 bg-white p-1 shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-16 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-500 text-sm">
                        Your signature
                      </div>
                    )}
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