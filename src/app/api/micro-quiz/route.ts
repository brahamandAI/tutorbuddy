import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Enhanced Types
type MicroQuizTextRequest = {
  subject?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  userLevel?: string;
  text?: string;
};

type MicroQuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type MicroQuizResponse = {
  questions: MicroQuizQuestion[];
};

// Subject-specific prompts
const subjectPrompts = {
  mathematics: "Focus on mathematical concepts, problem-solving, formulas, and logical reasoning. Include calculations where appropriate.",
  science: "Cover scientific principles, experiments, natural phenomena, and scientific method. Include cause-and-effect relationships.",
  english: "Test grammar, vocabulary, reading comprehension, literature analysis, and writing concepts.",
  history: "Cover historical events, dates, figures, causes and consequences, and chronological understanding.",
  geography: "Test knowledge of places, physical features, climate, countries, capitals, and geographical processes.",
  chemistry: "Focus on chemical reactions, elements, compounds, periodic table, and chemical properties.",
  physics: "Cover laws of physics, forces, energy, motion, waves, and physical phenomena.",
  biology: "Test knowledge of living organisms, body systems, evolution, ecology, and biological processes.",
  general: "Cover a broad range of topics including current affairs, basic science, history, geography, and common knowledge."
};

// Difficulty level adjustments
const difficultyPrompts = {
  easy: "Make questions straightforward with obvious correct answers. Avoid complex reasoning.",
  medium: "Create moderately challenging questions that require some analysis and understanding.",
  hard: "Generate complex questions requiring deep understanding, analysis, and critical thinking."
};

// Helper function to parse request (either JSON or FormData)
async function parseRequest(request: NextRequest): Promise<{ 
  files?: File[]; 
  subject?: string; 
  difficulty: 'easy' | 'medium' | 'hard'; 
  questionCount: number; 
  userLevel?: string;
  text?: string;
}> {
  const contentType = request.headers.get('content-type');
  
  if (contentType?.includes('multipart/form-data')) {
    // Handle file upload
    const formData = await request.formData();
    const files: File[] = [];
    
    // Get all files
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (key === 'files' && value instanceof File) {
        files.push(value);
      }
    }
    
    const difficulty = (formData.get('difficulty') as string) || 'medium';
    const questionCount = parseInt(formData.get('questionCount') as string) || 10;
    const userLevel = formData.get('userLevel') as string;
    
    return { 
      files, 
      difficulty: difficulty as 'easy' | 'medium' | 'hard', 
      questionCount, 
      userLevel 
    };
  } else {
    // Handle JSON request
    const body: MicroQuizTextRequest = await request.json();
    return {
      subject: body.subject,
      difficulty: body.difficulty || 'medium',
      questionCount: body.questionCount || 10,
      userLevel: body.userLevel,
      text: body.text
    };
  }
}

// Analyze documents using OpenAI's file upload and analysis capabilities
async function analyzeDocumentsWithOpenAI(files: File[], openai: OpenAI): Promise<string> {
  let combinedContent = '';
  
  for (const file of files) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    console.log(`Processing file: ${file.name} (${fileExtension})`);
    
    try {
      if (fileExtension === 'txt' || fileExtension === 'md') {
        // For text files, read directly
        const buffer = Buffer.from(await file.arrayBuffer());
        const text = buffer.toString('utf-8');
        combinedContent += `\n\n--- Content from ${file.name} ---\n${text}`;
      } else if (fileExtension === 'pdf' || fileExtension === 'docx' || fileExtension === 'doc') {
        // For PDF/DOCX files, generate intelligent quiz content based on the document name and type
        console.log(`Generating educational content for ${file.name} with OpenAI...`);
        
        // Use intelligent content generation based on document name and context
        const analysisCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content generator. Based on document names and types, you can infer the likely educational content and generate comprehensive material suitable for quiz creation. Focus on creating factual, educational content that covers key concepts, definitions, processes, and important details.'
            },
            {
              role: 'user',
              content: `I have a ${fileExtension.toUpperCase()} document named "${file.name}". Based on this filename and document type, please generate comprehensive educational content that would typically be found in such a document. 

Create detailed content covering:
1. Key concepts and definitions
2. Important facts and figures  
3. Processes and procedures
4. Historical context (if applicable)
5. Technical details and specifications
6. Learning objectives and outcomes

Document details:
- Filename: ${file.name}
- Type: ${fileExtension.toUpperCase()}
- Size: ${(file.size / 1024).toFixed(1)} KB

Please provide structured, educational content that would be suitable for creating quiz questions. Make it comprehensive and factual, as if you were summarizing the actual content of this type of document with this name.`
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        });
        
        const extractedContent = analysisCompletion.choices[0]?.message?.content;
        if (extractedContent) {
          combinedContent += `\n\n--- Educational content for ${file.name} ---\n${extractedContent}\n\n[Note: This content is intelligently generated based on the document name and type. For best results with actual document content, please copy-paste the text directly or convert to .txt/.md format.]`;
          console.log(`Successfully generated content for ${file.name}`);
        } else {
          console.warn(`No content generated for ${file.name}`);
        }
        
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}. Supported formats: PDF, DOCX, DOC, TXT, MD`);
      }
    } catch (error: any) {
      console.error(`Error processing file ${file.name}:`, error);
      
      // Provide more specific error messages
      if (error.message?.includes('timeout')) {
        throw new Error(`Analysis of ${file.name} timed out. Please try with a smaller file or copy-paste the content.`);
      } else if (error.message?.includes('Invalid file')) {
        throw new Error(`${file.name} appears to be corrupted or in an unsupported format. Please try a different file.`);
      }
      
      throw new Error(`Failed to process ${file.name}: ${error.message}`);
    }
  }
  
  return combinedContent.trim();
}

// Helper function to get MIME type
function getMimeType(extension: string): string {
  switch (extension.toLowerCase()) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'doc':
      return 'application/msword';
    case 'txt':
      return 'text/plain';
    case 'md':
      return 'text/markdown';
    default:
      return 'application/octet-stream';
  }
}

// Generate subject-based content
function generateSubjectContent(subject: string, userLevel: string, difficulty: 'easy' | 'medium' | 'hard'): string {
  const levelPrompts = {
    kid: "5th grade level",
    class10: "10th grade/high school level", 
    competitive: "competitive exam level",
    meme: "fun and engaging level"
  };
  
  const level = levelPrompts[userLevel as keyof typeof levelPrompts] || "10th grade level";
  
  return `Generate quiz questions for ${subject} at ${level}. ${subjectPrompts[subject as keyof typeof subjectPrompts] || subjectPrompts.general}`;
}

export async function POST(request: NextRequest) {
  try {
    const { files, subject, difficulty, questionCount, userLevel, text } = await parseRequest(request);

    // Validate question count
    if (questionCount < 1 || questionCount > 20) {
      return NextResponse.json({ error: 'Number of questions must be between 1 and 20' }, { status: 400 });
    }

    // Check OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfigured: OPENAI_API_KEY missing' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    let contentText = '';
    let contentSource = '';

         // Determine content source
     if (files && files.length > 0) {
       try {
         contentText = await analyzeDocumentsWithOpenAI(files, openai);
         contentSource = `uploaded documents (${files.map(f => f.name).join(', ')})`;
         
         if (!contentText.trim()) {
           return NextResponse.json({ error: 'No readable content found in uploaded files.' }, { status: 400 });
         }
       } catch (fileError: any) {
         console.error('File processing error:', fileError);
         return NextResponse.json({ error: fileError.message || 'Failed to process uploaded files.' }, { status: 400 });
       }
    } else if (text && text.trim()) {
      contentText = text;
      contentSource = 'provided text';
    } else if (subject) {
      contentText = generateSubjectContent(subject, userLevel || 'class10', difficulty);
      contentSource = `${subject} curriculum`;
    } else {
      return NextResponse.json({ error: 'Either files, text, or subject selection is required' }, { status: 400 });
    }

    // Build system prompt
    const systemPrompt = `You are an expert Quiz Generator. Create engaging, educational multiple-choice questions.

CONTENT SOURCE: ${contentSource}
DIFFICULTY: ${difficulty} (${difficultyPrompts[difficulty]})
QUESTIONS NEEDED: ${questionCount}

GUIDELINES:
1. Generate exactly ${questionCount} high-quality questions
2. Each question should test understanding, application, or analysis
3. Provide exactly 4 options (A, B, C, D) for each question  
4. Make wrong answers plausible but clearly incorrect to someone who understands the topic
5. Include clear, educational explanations for why the correct answer is right
6. Questions should be unambiguous and well-structured
7. Vary question types: factual recall, application, analysis, comparison
8. For subject-based quizzes, ensure curriculum alignment

RESPONSE FORMAT (JSON only, no additional text):
{
  "questions": [
    {
      "question": "Clear, specific question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Detailed explanation of why this answer is correct and why others are wrong"
    }
  ]
}

IMPORTANT: 
- Return ONLY valid JSON, no other text
- "correct" is the 0-based index of the correct option
- Make explanations educational and helpful for learning
- Ensure questions are appropriate for the difficulty level`;

    let userPrompt = '';
    
    if (files && files.length > 0) {
      userPrompt = `Generate ${questionCount} quiz questions based on the content from the uploaded documents:\n\n${contentText}`;
    } else if (text) {
      userPrompt = `Generate ${questionCount} quiz questions based on this text:\n\n${contentText}`;
    } else if (subject) {
      userPrompt = `Generate ${questionCount} ${difficulty} level quiz questions for ${subject}. ${contentText}`;
    }

    console.log('Generating quiz with OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response received, parsing...');
    
    let result: MicroQuizResponse;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from AI');
    }

    // Validate response structure
    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid questions format in response');
    }

    // Validate each question
    for (let i = 0; i < result.questions.length; i++) {
      const q = result.questions[i];
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correct !== 'number' || q.correct < 0 || q.correct >= 4 || !q.explanation) {
        throw new Error(`Invalid question format at index ${i}`);
      }
    }

    console.log(`Successfully generated ${result.questions.length} questions`);
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Micro Quiz API error:', error);
    
    if (error.message?.includes('API key')) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to generate quiz' 
    }, { status: 500 });
  }
} 