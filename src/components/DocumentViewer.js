'use client'
import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
 
function useTextSelection(textLayerRef, activeTool, pageNumber, change, handleTextSelection) {
  useEffect(() => {
    const layer = textLayerRef.current;
    if (!layer) {
      console.log('Text layer not available');
      return;
    }
  
    const handleMouseUp = (e) => {
      console.log('text selection working in mouseUp', layer);
      console.log('MouseUp event on text layer', e.target);
      
      console.log('MouseUp event on text layer', activeTool);
      if (!activeTool || !(activeTool === 'highlight' || activeTool === 'underline')) {
        return;
      }

      // Get selection relative to the text layer
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !selection.toString().trim()) {
        console.log('No valid text selection');
        return;
      }

      // Calculate positions relative to the text layer
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();

      const relativeX = rect.left - layerRect.left;
      const relativeY = rect.top - layerRect.top;

      console.log('Selected text:', {
        text: selection.toString(),
        pageNumber,
        position: { x: relativeX, y: relativeY },
        dimensions: { width: rect.width, height: rect.height }
      });

      // Pass the full selection object to handleTextSelection
      handleTextSelection({
        text: selection.toString(),
        pageNumber,
        position: {
          x: relativeX,
          y: relativeY,
          width: rect.width,
          height: rect.height
        }
      });
    };

    layer.addEventListener('mouseup', handleMouseUp, { passive: false });
    
    return () => {
      console.log('Cleaning up text selection handler');
      layer.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeTool, pageNumber, handleTextSelection, textLayerRef.current, change]);
}

export default function DocumentViewer({ 
  pdfFile, 
  numPages, 
  setNumPages, 
  annotations, 
  addAnnotation, 
  setPdfFile,
  selectedText,
  comments,
  activeColor,
  setActiveColor, 
  signatures,
  selectionPosition,
  handleTextSelection,
  setSelectedText, activeTool, setActiveTool
}) {
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [change, setChange] = useState(false) 
  const [isLoading, setIsLoading] = useState(false)
  const documentRef = useRef(null)
  const textLayerRef = useRef(null)
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 }) 
  useEffect(() => {
    const handleResize = () => {
      const container = documentRef.current
      if (container) {
        setPdfDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pdfFile])
 
useEffect(() => {
  console.log(activeTool, selectedText)
  if (selectedText && activeTool && selectionPosition) {
    
    addAnnotation(activeTool, activeColor);
    setActiveTool(null);
  }
}, [selectedText, activeTool, activeColor, addAnnotation, selectionPosition]);

  // Setup text selection handling
  useTextSelection(textLayerRef, activeTool, pageNumber, change,handleTextSelection)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setIsLoading(true)
      setPdfFile(file)
      setSelectedText(null)
      setActiveTool(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setIsLoading(true)
      setPdfFile(file)
      setSelectedText(null)
      setActiveTool(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-col items-center w-full">
      {!pdfFile ? (
        <div 
          className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 w-full max-w-2xl"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('pdf-upload').click()}
        >
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-700">Drag & drop a PDF file here</p>
            <p className="text-gray-500">or click to browse files</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              Select PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            {/* Page controls... (keep your existing page controls) */}
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-gray-700">Loading PDF...</p>
                </div>
              </div>
            )}
            
            {selectionPosition && (
              <div 
                className="absolute border-2 border-blue-500 pointer-events-none bg-blue-100 bg-opacity-30"
                style={{
                  left: `${selectionPosition.x}px`,
                  top: `${selectionPosition.y}px`,
                  width: `${selectionPosition.width}px`,
                  height: `${selectionPosition.height}px`
                }}
              />
            )}
            
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="p-12 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              error={
                <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg mx-auto max-w-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-lg font-medium">Failed to load PDF</p>
                  <p className="mt-1 text-sm">Please try again with a different file</p>
                </div>
              }
              inputRef={documentRef}
              className="w-full"
            >
             <Page 
  pageNumber={pageNumber} 
  scale={scale}
  renderAnnotationLayer={true}
  renderTextLayer={true}
  onLoadSuccess={() => {
    setTimeout(() => {
      const layer = document.querySelector('.react-pdf__Page__textContent');
      if (layer) {
        console.log('Found text layer:', layer);
        textLayerRef.current = layer;
       
        setPageNumber(prev => prev);  
        setChange(true)
      }
    }, 300);
  }}
  className="border-b"
  loading={
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  }
/>
              
<div className="absolute inset-0 pointer-events-none">
    {/* Annotations overlay */}
    <div className="relative" style={{
      width: `${pdfDimensions.width}px`,
      height: `${pdfDimensions.height}px`
    }}>
      {/* Render signatures */}
      {signatures.map((signature, index) => (
        signature.pageNumber === pageNumber && (
          <img
            key={index}
            src={signature.data}
            alt="Signature"
            className="absolute pointer-events-auto"
            style={{
              left: `${signature.position.x}px`,
              top: `${signature.position.y}px`,
              width: '200px',
              height: '80px',
              zIndex: 10
            }}
          />
        )
      ))}

      {/* Render comments */}
      {comments.map((comment, index) => (
        comment.pageNumber === pageNumber && (
          <div
            key={index}
            className="absolute bg-yellow-100 border border-yellow-300 p-2 rounded max-w-xs pointer-events-auto"
            style={{
              left: `${comment.position.x}px`,
              top: `${comment.position.y}px`,
              zIndex: 10
            }}
          >
            {comment.text}
          </div>
        )
      ))}

      {/* Render selection highlights */}
      {annotations.map((annotation, index) => (
        annotation.pageNumber === pageNumber && (
          <div
            key={index}
            className={`absolute ${annotation.type === 'highlight' ? 'bg-yellow-200 opacity-50' : 'border-b-2 border-blue-500'}`}
            style={{
              left: `${annotation.position.x}px`,
              top: `${annotation.position.y}px`,
              width: `${annotation.position.width}px`,
              height: `${annotation.position.height}px`,
              backgroundColor: annotation.type === 'highlight' ? annotation.color : 'transparent',
              borderColor: annotation.type === 'underline' ? annotation.color : 'transparent'
            }}
          />
        )
      ))}
    </div>
  </div>
            </Document>
          </div>
        </div>
      )}
    </div>
  )
}