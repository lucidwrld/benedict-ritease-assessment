'use client'
import { createContext, useContext } from 'react'
import { usePdfAnnotations } from '@/hooks/usePdfAnnotations'

const DocumentContext = createContext()

export function DocumentProvider({ children }) {
  const pdf = usePdfAnnotations()
  return (
    <DocumentContext.Provider value={pdf}>
      {children}
    </DocumentContext.Provider>
  )
}

export function usePdf() {
  return useContext(DocumentContext)
}