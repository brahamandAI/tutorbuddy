import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

type ExplainTextRequest = {
  text: string;
  level: 'kid' | 'class10' | 'competitive' | 'meme';
};

type ExplainResponse = {
  explanation: string;
  mediaHints?: string[];
};

const levelPrompts = {
  kid: "Explain this like I'm 5 years old. Use very simple words, short sentences, and fun examples that kids can understand.",
  class10: "Explain this for a 10th grade student. Use clear language with some technical terms but make sure to define them. Include relevant examples.",
  competitive: "Explain this for competitive exam preparation. Be thorough, include advanced concepts, terminology, and detailed explanations that would help in exams.",
  meme: "Explain this in a fun, meme-worthy way with humor, internet slang, and relatable references. Make it entertaining while still being educational."
};

// Helper function to parse request (either JSON or FormData)
async function parseRequest(request: NextRequest): Promise<{ text?: string; file?: Buffer; fileName?: string; level: 'kid' | 'class10' | 'competitive' | 'meme' }> {
  const contentType = request.headers.get('content-type');
  
  if (contentType?.includes('multipart/form-data')) {
    // Handle file upload
    const formData = await request.formData();
    const fileInput = formData.get('file') as File;
    const level = formData.get('level') as string;
    
    if (fileInput) {
      const buffer = Buffer.from(await fileInput.arrayBuffer());
      return { file: buffer, fileName: fileInput.name, level: level as 'kid' | 'class10' | 'competitive' | 'meme' };
    }
    throw new Error('No file provided');
  } else {
    // Handle text input
    const body: ExplainTextRequest = await request.json();
    return { text: body.text, level: body.level };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, file, fileName, level } = await parseRequest(request);

    if ((!text || !text.trim()) && !file) {
      return NextResponse.json({ error: 'Either text or file is required' }, { status: 400 });
    }

    if (!level || !levelPrompts[level]) {
      return NextResponse.json({ error: 'Valid level is required (kid, class10, competitive, meme)' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfigured: OPENAI_API_KEY missing' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are Magic Explain, an AI tutor that makes complex topics easy to understand. ${levelPrompts[level]}

Your response should be:
1. Clear and engaging explanation
2. Use appropriate language for the specified level
3. Include examples when helpful
4. Be encouraging and positive

If the content contains mathematical formulas, scientific concepts, or technical terms, make sure to break them down appropriately for the level.`;

    let completion: any;

    if (file && fileName) {
      // Handle file upload - extract text content first
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      let extractedText = '';

      try {
        if (fileExtension === 'txt' || fileExtension === 'md') {
          // Plain text files
          extractedText = file.toString('utf-8');
        } else if (fileExtension === 'pdf') {
          // For PDF files, we'll need to extract text
          // For now, return an error asking users to copy-paste content
          return NextResponse.json({ 
            error: 'PDF parsing is not yet implemented. Please copy and paste the text content instead, or try uploading a .txt or .md file.' 
          }, { status: 400 });
        } else if (fileExtension === 'docx' || fileExtension === 'doc') {
          // For Word documents, we'll need to extract text
          // For now, return an error asking users to copy-paste content
          return NextResponse.json({ 
            error: 'Word document parsing is not yet implemented. Please copy and paste the text content instead, or try uploading a .txt or .md file.' 
          }, { status: 400 });
        } else {
          return NextResponse.json({ 
            error: 'Unsupported file type. Please upload .txt or .md files, or copy and paste the content.' 
          }, { status: 400 });
        }

        if (!extractedText.trim()) {
          return NextResponse.json({ 
            error: 'No readable content found in the file.' 
          }, { status: 400 });
        }

        // Use the extracted text like regular text input
        const userPrompt = `I've uploaded a document with the following content. Please explain it comprehensively for the specified level:\n\n${extractedText}`;

        completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

      } catch (fileError) {
        console.error('File processing error:', fileError);
        return NextResponse.json({ 
          error: 'Failed to process the uploaded file. Please try uploading a different file or copy-paste the content.' 
        }, { status: 400 });
      }
    } else {
      // Handle text input
      const userPrompt = `Please explain this text: "${text || ''}"`;

      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });
    }

    const explanation = completion.choices[0]?.message?.content || 'Failed to generate explanation';

    // Generate media hints based on content
    const mediaHints: string[] = [];
    const contentLower = (text || fileName || '').toLowerCase();
    
    if (contentLower.includes('math') || contentLower.includes('equation') || contentLower.includes('formula')) {
      mediaHints.push('📊 Visual diagrams might help');
    }
    if (contentLower.includes('history') || contentLower.includes('war') || contentLower.includes('ancient')) {
      mediaHints.push('🏛️ Historical timeline could be useful');
    }
    if (contentLower.includes('science') || contentLower.includes('experiment') || contentLower.includes('physics')) {
      mediaHints.push('🧪 Scientific demonstration recommended');
    }
    if (contentLower.includes('geography') || contentLower.includes('country') || contentLower.includes('continent')) {
      mediaHints.push('🗺️ Maps and visual aids suggested');
    }
    if (file) {
      mediaHints.push('📄 Document analysis completed');
    }

    const response: ExplainResponse = {
      explanation,
      mediaHints: mediaHints.length > 0 ? mediaHints : undefined
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Magic Explain API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation. Please try again.' },
      { status: 500 }
    );
  }
} 