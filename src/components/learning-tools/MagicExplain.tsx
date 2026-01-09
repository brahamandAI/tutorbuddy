'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { postJSON, postForm } from '@/lib/apiClient';
import { Upload, FileText, File, X } from 'lucide-react';

type ExplainLevel = 'Kid' | 'Class10' | 'Competitive' | 'Meme';
type ExplainApiLevel = 'kid' | 'class10' | 'competitive' | 'meme';

const levels = [
  { value: 'Kid', label: 'Kid (5y)' },
  { value: 'Class10', label: 'Class 10' },
  { value: 'Competitive', label: 'Competitive' },
  { value: 'Meme', label: 'Meme' },
];

function toApiLevel(level: ExplainLevel): ExplainApiLevel {
  switch (level) {
    case 'Kid': return 'kid';
    case 'Class10': return 'class10';
    case 'Competitive': return 'competitive';
    case 'Meme': return 'meme';
  }
}

type ExplainResponse = {
  explanation: string;
  mediaHints?: string[];
};

const SUPPORTED_FILE_TYPES = {
  'text/markdown': 'Markdown',
  'text/plain': 'Text'
};

interface MagicExplainProps {
  showTitle?: boolean;
  contextText?: string;
}

export const MagicExplain = ({ showTitle = true, contextText = '' }: MagicExplainProps) => {
  const { currentTool, closeTool, selectedText, userMeta, saveToolResult, getToolResult, onToolUsed, setSelectedText } = useLearningTools();
  const [level, setLevel] = useState<ExplainLevel>(userMeta.classLevel);
  const [text, setText] = useState(selectedText);
  const [file, setFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'text' | 'file'>('text');
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-preload highlighted text
  useEffect(() => {
    if (currentTool === 'magicExplain') {
      const last = getToolResult('magicExplain');
      if (last) setResult(last);
      const handler = () => {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
          setText(sel.toString());
          setSelectedText(sel.toString());
          setUploadMode('text');
        }
      };
      document.addEventListener('selectionchange', handler);
      return () => document.removeEventListener('selectionchange', handler);
    }
  }, [currentTool, getToolResult, setSelectedText]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
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
    
    // Check if file type is supported
    const isSupported = Object.keys(SUPPORTED_FILE_TYPES).includes(fileType) || 
                       ['md', 'txt'].includes(fileExtension || '');
    
    if (!isSupported) {
      setError('Currently only .txt and .md (Markdown) files are supported. For PDF/DOCX files, please copy and paste the text content.');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size too large. Please upload files smaller than 10MB.');
      return;
    }
    
    setFile(selectedFile);
    setUploadMode('file');
    setError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      let res: ExplainResponse;
      
      if (uploadMode === 'file' && file) {
        // Handle file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('level', toApiLevel(level));
        
        const payload = { file, level: toApiLevel(level) };
        res = await postForm<ExplainResponse>('/api/explain', formData);
        onToolUsed('magicExplain', payload, res);
      } else {
        // Handle text input
        const payload = { text, level: toApiLevel(level) };
        res = await postJSON<typeof payload, ExplainResponse>('/api/explain', payload);
        onToolUsed('magicExplain', payload, res);
      }
      
      setResult(res);
      saveToolResult('magicExplain', res);
    } catch (e: any) {
      setError(e.message || 'Failed to explain');
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
    <Modal open={currentTool === 'magicExplain'} onClose={closeTool} title="Magic Explain ✨">
      <div className="flex flex-col gap-4 max-w-2xl">
        <Select 
          label="Explain for" 
          value={level} 
          onChange={(value: string) => setLevel(value as ExplainLevel)} 
          options={levels} 
        />

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setUploadMode('text')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              uploadMode === 'text' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="inline w-4 h-4 mr-2" />
            Text Input
          </button>
          <button
            onClick={() => setUploadMode('file')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              uploadMode === 'file' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="inline w-4 h-4 mr-2" />
            File Upload
          </button>
        </div>

        {uploadMode === 'text' ? (
                     <TextArea 
             label="Text to explain" 
             value={text} 
             onChange={setText} 
             rows={6}
           />
        ) : (
          <div className="space-y-4">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.name)}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Drop your file here, or 
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-purple-600 hover:text-purple-700 ml-1"
                    >
                      browse
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Currently supports .txt and .md files (up to 10MB)
                    <br />
                    <span className="text-xs text-gray-400">For PDF/DOCX: copy-paste text content instead</span>
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
          className="bg-purple-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
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
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Explanation:</h3>
              <div className="text-gray-800 whitespace-pre-wrap">{result.explanation}</div>
            </div>
            
            {result.mediaHints && result.mediaHints.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Learning Tips:</h4>
                <ul className="list-disc ml-5 space-y-1">
                  {result.mediaHints.map((hint, i) => (
                    <li key={i} className="text-blue-800 text-sm">{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}; 