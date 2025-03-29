'use client'
import { useState } from 'react' 
import AnnotationTools from './AnnotationTools'
import SignaturePad from './SignaturePad'
import CommentsPanel from './CommentsPanel'
import { saveAs } from 'file-saver'

export default function Toolbar({pdfFile, annotations, activeTool,
  activeColor,
  setActiveColor, setActiveTool,exportPdf}) {  
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
 
  const handleExport = async () => {
    if (!pdfFile) return
    
    setIsExporting(true)
    try {
      const exportedPdf = await exportPdf()
      saveAs(exportedPdf, `annotated_${pdfFile.name}`)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <AnnotationTools 
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              setActiveColor={setActiveColor}
              activeColor={activeColor}
              setShowSignaturePad={setShowSignaturePad}
              setShowComments={setShowComments}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            {pdfFile && (
              <div className="flex items-center space-x-5">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm transition-all duration-150 flex items-center"
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export PDF
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSignaturePad && (
        <SignaturePad onClose={() => setShowSignaturePad(false)} />
      )}

      {showComments && (
        <CommentsPanel onClose={() => setShowComments(false)} />
      )}
    </div>
  )
}