'use client'
import { DocumentProvider } from '@/context/DocumentContext'
import DocumentViewer from '@/components/DocumentViewer'
import Toolbar from '@/components/Toolbar'

export default function Home() {
  return (
    <DocumentProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white">Document Signer & Annotation Tool</h1>
            <p className="text-blue-100 mt-1">Upload, annotate, and sign PDF documents with ease</p>
          </div>
        </header>
        
        <Toolbar />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <DocumentViewer />
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
           Benedict Kabiawu Document Signer & Annotation Tool © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </DocumentProvider>
  )
}