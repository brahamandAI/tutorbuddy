import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { pdfPath, pages } = await request.json()
    
    console.log('Testing PDF extraction for:', pdfPath)
    console.log('Selected pages:', pages)
    
    // Try to extract PDF text
    const result = await testPDFExtraction(pdfPath, pages)
    
    return NextResponse.json({
      success: true,
      pdfPath,
      pages,
      extractedContent: result,
      message: 'PDF extraction test completed'
    })
    
  } catch (error: any) {
    console.error('PDF extraction test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      pdfPath: request.body ? await request.json().then(body => body.pdfPath) : 'unknown'
    }, { status: 500 })
  }
}

async function testPDFExtraction(pdfPath: string, pages: number[]) {
  const pdfParse = require('pdf-parse')
  
  try {
    // Construct full path to PDF file
    const fullPdfPath = join(process.cwd(), 'public', pdfPath.replace('/pdfs/', '/pdfs/'))
    
    console.log('Looking for PDF at:', fullPdfPath)
    
    // Check if file exists
    if (!existsSync(fullPdfPath)) {
      throw new Error(`PDF file not found at: ${fullPdfPath}`)
    }
    
    console.log('PDF file found! Reading...')
    
    // Read PDF buffer
    const pdfBuffer = readFileSync(fullPdfPath)
    console.log('PDF buffer size:', pdfBuffer.length, 'bytes')
    
    // Parse PDF to extract text and metadata
    const pdfData = await pdfParse(pdfBuffer)
    
    console.log('PDF parsing complete!')
    console.log('Total pages:', pdfData.numpages)
    console.log('Text length:', pdfData.text?.length || 0)
    console.log('First 200 characters:', pdfData.text?.substring(0, 200))
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return {
        status: 'no_text',
        message: 'PDF parsed successfully but no text content found',
        metadata: {
          pages: pdfData.numpages,
          info: pdfData.info
        }
      }
    }
    
    // Extract text for specific pages
    const extractedContent = extractSpecificPages(pdfData, pages)
    
    return {
      status: 'success',
      message: 'Text extracted successfully',
      metadata: {
        totalPages: pdfData.numpages,
        textLength: pdfData.text.length,
        requestedPages: pages
      },
      extractedText: extractedContent,
      fullTextPreview: pdfData.text.substring(0, 500) + '...'
    }
    
  } catch (error: any) {
    console.error('PDF parsing error:', error)
    throw new Error(`PDF extraction failed: ${error.message}`)
  }
}

function extractSpecificPages(pdfData: any, pages: number[]): string {
  const totalPages = pdfData.numpages || 1
  const fullText = pdfData.text || ''
  
  // Split text by common page indicators or estimate based on text length
  const textLines = fullText.split('\n').filter((line: string) => line.trim().length > 0)
  
  if (textLines.length === 0) {
    return 'No readable text lines found'
  }
  
  // Estimate lines per page (this is an approximation)
  const estimatedLinesPerPage = Math.max(1, Math.floor(textLines.length / totalPages))
  
  let selectedText = ''
  
  for (const pageNum of pages) {
    if (pageNum > totalPages) {
      selectedText += `\n[Page ${pageNum} not available - PDF has only ${totalPages} pages]\n`
      continue
    }
    
    // Calculate approximate text range for this page
    const startLine = (pageNum - 1) * estimatedLinesPerPage
    const endLine = Math.min(pageNum * estimatedLinesPerPage, textLines.length)
    
    const pageText = textLines.slice(startLine, endLine).join('\n')
    
    if (pageText.trim()) {
      selectedText += `\n--- Page ${pageNum} Content ---\n${pageText}\n`
    } else {
      selectedText += `\n[Page ${pageNum} appears to have no text content]\n`
    }
  }
  
  return selectedText.trim() || 'No text content found for selected pages'
}

export async function GET() {
  return NextResponse.json({
    message: 'PDF Extraction Test API',
    usage: 'POST with { pdfPath, pages }',
    example: {
      pdfPath: '/pdfs/class1/class1english/Chapter-1.pdf',
      pages: [1, 2]
    }
  })
}