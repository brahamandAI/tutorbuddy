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
    const form = await req.formData();
    const message = form.get('message') as string;
    const image = form.get('image') as File | null;
    
    if (!message && !image) {
      return NextResponse.json({ error: 'Message or image is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfigured: OPENAI_API_KEY missing' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    
    let messages: any[] = [
      {
        role: 'system',
        content: `You are a world-class NEET/JEE tutor. Help students understand concepts, solve problems, and learn effectively. 
        
        When responding:
        - Be clear, concise, and educational
        - Provide step-by-step explanations when solving problems
        - Use examples to illustrate concepts
        - Encourage critical thinking
        - If analyzing an image with a question, extract the text and provide a complete solution`
      }
    ];

    // If there's an image, process it first
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString('base64');
      
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message || 'Please analyze this image and help me understand the question or concept.' },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
            },
          },
        ],
      });
    } else {
      // Text-only message
      messages.push({
        role: 'user',
        content: message
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      temperature: 0.7,
      messages,
    });

    const response = completion.choices?.[0]?.message?.content || 'Sorry, I couldn\'t process your request.';

    return NextResponse.json({
      response,
      hasImage: !!image,
    });
  } catch (err: any) {
    console.error('chat error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
} 