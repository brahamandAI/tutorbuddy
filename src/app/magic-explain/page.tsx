'use client';
import React, { useState, useRef, useEffect } from 'react';
import { LearningToolsProvider, useLearningTools } from '@/components/learning-tools';
import { postJSON, postForm } from '@/lib/apiClient';
// import Lottie from 'lottie-react';
// import magicAnimation from '@/public/animations/magic.json';

type ExplainLevel = 'Kid' | 'Class10' | 'Competitive' | 'Meme';



// MagicExplainInterface component for full-page functionality
function MagicExplainInterface() {
  const { selectedText, userMeta, onToolUsed } = useLearningTools();
  const [level, setLevel] = useState<ExplainLevel>(userMeta.classLevel as ExplainLevel || 'Class10');
  const [text, setText] = useState(selectedText || '');

  useEffect(() => {
    const asked = sessionStorage.getItem('tb-ask')
    if (asked) {
      setText(asked)
      sessionStorage.removeItem('tb-ask')
    }
  }, [])
  const [file, setFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'text' | 'file'>('text');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const levels = [
    { value: 'Kid', label: 'Kid (5y)' },
    { value: 'Class10', label: 'Class 10' },
    { value: 'Competitive', label: 'Competitive' },
    { value: 'Meme', label: 'Meme' },
  ];

  const toApiLevel = (level: string) => {
    switch (level) {
      case 'Kid': return 'kid';
      case 'Class10': return 'class10';
      case 'Competitive': return 'competitive';
      case 'Meme': return 'meme';
      default: return 'class10';
    }
  };

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const fileType = selectedFile.type;
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    const isSupported = ['md', 'txt'].includes(fileExtension || '');
    
    if (!isSupported) {
      setError('Currently only .txt and .md (Markdown) files are supported. For PDF/DOCX files, please copy and paste the text content.');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size too large. Please upload files smaller than 10MB.');
      return;
    }
    
    setFile(selectedFile);
    setUploadMode('file');
    setError(null);
  };

  const handleFileInputChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadMode('text');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExplain = async () => {
    if (!text.trim() && !file) {
      setError('Please enter text or upload a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      let res;
      
      if (uploadMode === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('level', toApiLevel(level));
        
        res = await postForm('/api/explain', formData);
      } else {
        const payload = { text, level: toApiLevel(level) };
        res = await postJSON('/api/explain', payload);
      }
      
      setResult(res);
      onToolUsed('magicExplain', { text, level }, res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to explain');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'md': return '📋';
      case 'txt': return '📄';
      default: return '📄';
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Explain a topic
      </h2>
      
      {/* Level Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
          Explain for:
        </label>
        <select 
          value={level} 
          onChange={(e) => setLevel(e.target.value as ExplainLevel)}
          className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-purple-800 dark:border-purple-600"
        >
          {levels.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setUploadMode('text')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            uploadMode === 'text' 
              ? 'bg-purple-600 text-white' 
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-200'
          }`}
        >
          📝 Text Input
        </button>
        <button
          onClick={() => setUploadMode('file')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            uploadMode === 'file' 
              ? 'bg-purple-600 text-white' 
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-800 dark:text-purple-200'
          }`}
        >
          📁 File Upload
        </button>
      </div>

      {uploadMode === 'text' ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
            Text to explain:
          </label>
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            rows={6}
            className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-purple-800 dark:border-purple-600"
            placeholder="Paste or type the text you want explained..."
          />
        </div>
      ) : (
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/50' 
                : 'border-purple-300 hover:border-purple-400 dark:border-purple-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file.name)}</span>
                  <div className="text-left">
                    <div className="font-medium text-purple-900 dark:text-purple-100">{file.name}</div>
                    <div className="text-sm text-purple-600 dark:text-purple-300">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-4">📁</div>
                <div className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Drop your file here, or 
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-600 hover:text-purple-700 ml-1 underline"
                  >
                    browse
                  </button>
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-300">
                  Currently supports .txt and .md files (up to 10MB)
                  <br />
                  <span className="text-xs text-purple-400">For PDF/DOCX: copy-paste text content instead</span>
                </div>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".md,.txt"
            onChange={handleFileInputChange}
          />
        </div>
      )}

      <button 
        className="w-full bg-purple-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6" 
        onClick={handleExplain} 
        disabled={loading || (!text.trim() && !file)}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Explaining...
          </div>
        ) : (
          'Explain ✨'
        )}
      </button>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 mb-6">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/50 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 text-lg">Explanation:</h3>
            <div className="text-purple-800 dark:text-purple-200 leading-relaxed">
              {result.explanation.split('\n').map((paragraph: string, index: number) => {
                if (paragraph.trim() === '') return null;
                
                // Check if it's a heading (starts with ###)
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={index} className="text-xl font-bold text-purple-900 dark:text-purple-100 mt-6 mb-3 first:mt-0">
                      {paragraph.replace('### ', '')}
                    </h4>
                  );
                }
                
                // Check if it's a numbered list item
                if (/^\d+\./.test(paragraph.trim())) {
                  return (
                    <div key={index} className="mb-3">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full text-sm flex items-center justify-center font-medium">
                          {paragraph.trim().charAt(0)}
                        </span>
                                                  <p className="flex-1 text-purple-800 dark:text-purple-200" dangerouslySetInnerHTML={{
                            __html: paragraph.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                          }}></p>
                      </div>
                    </div>
                  );
                }
                
                // Check if it's a bullet point
                if (paragraph.startsWith('- ')) {
                  return (
                    <div key={index} className="mb-2 flex items-start gap-3">
                      <span className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                                              <p className="flex-1 text-purple-800 dark:text-purple-200" dangerouslySetInnerHTML={{
                          __html: paragraph.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                        }}></p>
                    </div>
                  );
                }
                
                // Regular paragraph
                return (
                                     <p key={index} className="mb-4 text-purple-800 dark:text-purple-200 leading-relaxed" dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-purple-900 dark:text-purple-100">$1</strong>')
                    }}></p>
                );
              }).filter(Boolean)}
            </div>
          </div>
          
          {result.mediaHints && result.mediaHints.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                💡 Learning Tips:
              </h4>
              <ul className="space-y-2">
                {result.mediaHints.map((hint: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center font-medium mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MagicExplainPage() {
  return (
    <LearningToolsProvider questionRef="magic-explain-page" initialText="">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Magic Explain</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Paste any text and get an explanation at the level you need.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <MagicExplainInterface />
        </div>
      </div>
    </LearningToolsProvider>
  );
} 