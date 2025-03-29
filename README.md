# Document Signer & Annotation Tool

## Overview
A PDF annotation and signing tool that allows users to:
- Upload PDF documents
- Highlight and underline text
- Add comments with adjustable position and size
- Insert digital signatures
- Export annotated PDFs

## Features
- **Text Annotations**: Highlight and underline text selections
- **Comments**: Add sticky-note style comments anywhere on the document
- **Signatures**: Create and position digital signatures
- **Export**: Save annotated PDFs with all modifications
- **Responsive**: Works across different screen sizes

## Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]

2.   npm install
3.   npm run dev
4.   

## Dependencies
- Library	Purpose
- react-pdf	PDF rendering
- pdf-lib	PDF modification
- pdfjs-dist	PDF parsing
- react-colorful	Color selection
- react-draggable	UI element positioning
- react-signature-canvas	Signature capture
- file-saver	File downloads
Technical Challenges & Solutions
Text Selection Accuracy
Implemented custom position calculation relative to PDF text layers

Annotation Persistence
Created centralized state management using React Context

PDF Export Precision
Used PDF-Lib with coordinate system transformations

Future Enhancements
Annotation editing (move/resize/change)

Multi-page comments

Undo/redo functionality

Cloud storage integration

Additional annotation types (shapes, freehand)

