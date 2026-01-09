import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface MetadataRequest {
  pdfPath: string
}

export async function POST(request: NextRequest) {
  try {
    const body: MetadataRequest = await request.json()
    const { pdfPath } = body

    if (!pdfPath) {
      return NextResponse.json(
        { error: 'PDF path is required' },
        { status: 400 }
      )
    }

    // Try to read the PDF file from the public directory
    let fullPath = pdfPath

    // If it's a relative path starting with /, convert to absolute
    if (pdfPath.startsWith('/')) {
      fullPath = join(process.cwd(), 'public', pdfPath)
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      // Try alternative path without /public prefix
      const altPath = join(process.cwd(), pdfPath.replace(/^\//, ''))
      if (existsSync(altPath)) {
        fullPath = altPath
      } else {
        console.log('PDF file not found:', fullPath)
        // Return a reasonable default instead of erroring
        return NextResponse.json({
          success: false,
          pageCount: 30, // Default fallback
          message: 'PDF not found, using default page count'
        })
      }
    }

    try {
      // Require the lib directly to avoid debug code in index.js that tries to read test files
      const pdfParse = require('pdf-parse/lib/pdf-parse.js')
      
      // Read and parse PDF
      const dataBuffer = readFileSync(fullPath)
      const pdfData = await pdfParse(dataBuffer)

      return NextResponse.json({
        success: true,
        pageCount: pdfData.numpages,
        title: pdfData.info?.Title || undefined,
        author: pdfData.info?.Author || undefined,
        pdfPath: pdfPath
      })
    } catch (parseError) {
      console.error('Error parsing PDF:', parseError)
      // Return a reasonable default
      return NextResponse.json({
        success: false,
        pageCount: 30,
        message: 'Could not parse PDF, using default page count'
      })
    }

  } catch (error) {
    console.error('Error in PDF metadata API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get PDF metadata',
        pageCount: 30 // Fallback default
      },
      { status: 200 } // Don't fail completely, return default
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'PDF Metadata API',
    usage: 'POST with { pdfPath }',
    returns: '{ pageCount, title, author }'
  })
}
