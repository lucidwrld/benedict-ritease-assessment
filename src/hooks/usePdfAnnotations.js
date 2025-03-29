import { useState, useEffect } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import { saveAs } from 'file-saver'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export function usePdfAnnotations() {
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfBytes, setPdfBytes] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [activeColor, setActiveColor] = useState('#FFD700') 
  const [annotations, setAnnotations] = useState([])
  const [signatures, setSignatures] = useState([])
  const [comments, setComments] = useState([])
  const [selectedText, setSelectedText] = useState(null)
  const [selectionPosition, setSelectionPosition] = useState(null)
  const [activeTool, setActiveTool] = useState(null)
  useEffect(() => {
    if (pdfFile) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const bytes = new Uint8Array(e.target.result)
        setPdfBytes(bytes)
        
        // Get number of pages
        const loadingTask = pdfjsLib.getDocument(bytes)
        const pdf = await loadingTask.promise
        setNumPages(pdf.numPages)
      }
      reader.readAsArrayBuffer(pdfFile)
    }
  }, [pdfFile])

  // Modify the handleTextSelection function to accept either page number or full selection data
const handleTextSelection = (currentPageNumberOrSelection) => {
  // If we receive just the page number (original behavior)
  if (typeof currentPageNumberOrSelection === 'number') {
    const currentPageNumber = currentPageNumberOrSelection;
    console.log("Starting text selection processing...");
    
    // Add small delay to ensure selection is available
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !selection.toString().trim()) {
        console.log('No valid text selection found');
        return;
      }
  
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Get the specific page container
      const pageContainer = document.querySelector(`.react-pdf__Page[data-page-number="${currentPageNumber}"]`);
      if (!pageContainer) {
        console.error('Page container not found');
        return;
      }
      
      const pageRect = pageContainer.getBoundingClientRect();
      
      // Calculate positions relative to the page
      const relativeX = rect.left - pageRect.left;
      const relativeY = rect.top - pageRect.top;
      
      console.log('Captured selection:', {
        text: selection.toString(),
        page: currentPageNumber,
        position: { x: relativeX, y: relativeY },
        dimensions: { width: rect.width, height: rect.height }
      });
      console.log(selection)
      setSelectedText({
        text: selection.toString(),
        pageNumber: currentPageNumber
      });
      
      setSelectionPosition({
        x: relativeX,
        y: relativeY,
        width: rect.width,
        height: rect.height
      });
    }, 50);
  } 
  // If we receive a full selection object (from useTextSelection hook)
  else {
    const selection = currentPageNumberOrSelection;
    console.log('Received pre-calculated selection:', selection);
    
    setSelectedText({
      text: selection.text,
      pageNumber: selection.pageNumber
    });
    
    setSelectionPosition({
      x: selection.position.x,
      y: selection.position.y,
      width: selection.position.width,
      height: selection.position.height
    });
  }
};
  const addAnnotation = async (type, color) => {
    if (!selectedText || !pdfBytes) return
    
    const newAnnotation = {
      type,
      color,
      text: selectedText.text,
      pageNumber: selectedText.pageNumber,
      position: selectionPosition
    }
    
    setAnnotations([...annotations, newAnnotation])
    setSelectedText(null)
    setSelectionPosition(null)
  }

  const addSignature = async (signatureData, position = { x: 100, y: 100 }) => {
    if (!pdfBytes) return
    
    const newSignature = {
      data: signatureData,
      pageNumber: 1, // For simplicity, we'll assume page 1
      position
    }
    
    setSignatures([...signatures, newSignature])
  }

  const addComment = async (text, position = { x: 100, y: 100 }) => {
    if (!pdfBytes) return
    
    const newComment = {
      text,
      pageNumber: 1, // For simplicity, we'll assume page 1
      position
    }
    
    setComments([...comments, newComment])
  }

  const exportPdf = async () => {
    if (!pdfBytes) return
    
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    
    // Add annotations
    annotations.forEach(annotation => {
      if (annotation.pageNumber <= pages.length) {
        const page = pages[annotation.pageNumber - 1]
        const { x, y, width, height } = annotation.position
        
        switch (annotation.type) {
          case 'highlight':
            page.drawRectangle({
              x: x,
              y: page.getHeight() - y - height,
              width: width,
              height: height,
              color: rgb(
                parseInt(annotation.color.slice(1, 3), 16) / 255,
                parseInt(annotation.color.slice(3, 5), 16) / 255,
                parseInt(annotation.color.slice(5, 7), 16) / 255
              ),
              opacity: 0.5
            })
            break
          case 'underline':
            page.drawLine({
              start: { x: x, y: page.getHeight() - y - 2 },
              end: { x: x + width, y: page.getHeight() - y - 2 },
              thickness: 2,
              color: rgb(
                parseInt(annotation.color.slice(1, 3), 16) / 255,
                parseInt(annotation.color.slice(3, 5), 16) / 255,
                parseInt(annotation.color.slice(5, 7), 16) / 255
              )
            })
            break
        }
      }
    })
    
    // Add signatures
    for (const signature of signatures) {
      if (signature.pageNumber <= pages.length) {
        const page = pages[signature.pageNumber - 1]
        const imageBytes = await fetch(signature.data)
          .then(res => res.arrayBuffer())
        const image = await pdfDoc.embedPng(imageBytes)
        
        page.drawImage(image, {
          x: signature.position.x,
          y: page.getHeight() - signature.position.y - 100,
          width: 200,
          height: 80
        })
      }
    }
    
    // Add comments
    comments.forEach(comment => {
      if (comment.pageNumber <= pages.length) {
        const page = pages[comment.pageNumber - 1]
        page.drawText(comment.text, {
          x: comment.position.x,
          y: page.getHeight() - comment.position.y,
          size: 12,
          color: rgb(0, 0, 0)
        })
      }
    })
    
    const modifiedPdfBytes = await pdfDoc.save()
    return new Blob([modifiedPdfBytes], { type: 'application/pdf' })
  } 

  return {
    pdfFile,
    setPdfFile,
    numPages,
    setNumPages,
    annotations,
    addAnnotation,
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    signatures,
    addSignature,
    comments,
    addComment,
    exportPdf,
    selectedText,
    selectionPosition,
    handleTextSelection,
    setSelectedText,
    setSelectionPosition
  }
}