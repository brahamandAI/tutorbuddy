import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

function extractJsonFromText(text: string): any {
  try {
    // Try direct JSON first
    return JSON.parse(text);
  } catch {}
  // Try to extract JSON from code fences or surrounding text
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  return null;
}

export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PUBLIC_DEMO === '1') {
      return NextResponse.json({
        ocrText: 'This is a demo OCR text.',
        steps: ['Step 1: Demo', 'Step 2: Demo'],
        explanation: 'This is a demo explanation.',
      });
    }

    const form = await req.formData();
    const file = form.get('image');
    if (!file) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }
    
    // Check if file is a Blob/File-like object with arrayBuffer method
    if (typeof file !== 'object' || !file || typeof (file as any).arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfigured: OPENAI_API_KEY missing' }, { status: 500 });
    }

    // Read image into Buffer
    const bytes = await (file as any).arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use OpenAI Vision for both OCR and problem solving
    const openai = new OpenAI({ apiKey });
    
    // Convert buffer to base64 for OpenAI Vision
    const base64Image = buffer.toString('base64');
    
    const system = `You are a world-class NEET/JEE tutor. Analyze the image containing a question and provide a step-by-step solution. Return STRICT JSON only.`;

    const user = `Please analyze this image containing a question and return JSON with the following shape:
{
  "ocrText": "The text extracted from the image",
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "explanation": "Clear explanation of the solution and final answer"
}

Guidelines:
- Extract all text from the image accurately
- Provide 3-4 clear, numbered steps
- Give a concise explanation with the final answer
- Return only valid JSON, no code fences or extra text`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: [
            { type: 'text', text: user },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content || '';
    const parsed = extractJsonFromText(content);

    if (!parsed || !parsed.ocrText || !Array.isArray(parsed.steps) || typeof parsed.explanation !== 'string') {
      return NextResponse.json(
        { error: 'AI response malformed. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ocrText: parsed.ocrText,
      steps: parsed.steps,
      explanation: parsed.explanation,
      isRealOCR: true, // Always true since we're using real OCR now
    });
  } catch (err: any) {
    console.error('snap-solve error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
} 