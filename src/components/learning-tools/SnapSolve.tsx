'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { postForm } from '@/lib/apiClient';
import { Send, Image as ImageIcon, X, Camera, Upload } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  hasImage?: boolean;
  imageUrl?: string;
}

interface SnapSolveProps {
  showTitle?: boolean;
  contextText?: string;
}

export const SnapSolve = ({ showTitle = true, contextText = '' }: SnapSolveProps) => {
  const { currentTool, closeTool, saveToolResult, getToolResult, onToolUsed } = useLearningTools();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your Snap & Solve assistant. 📸\n\nI can help you solve any problem by:\n• Taking a photo of your question\n• Uploading an image from your gallery\n• Or you can just type your question\n\nWhat would you like to solve today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim() || 'Please solve this problem',
      hasImage: !!selectedImage,
      imageUrl: imagePreview || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const form = new FormData();
      if (inputMessage.trim()) {
        form.append('message', inputMessage.trim());
      }
      if (selectedImage) {
        form.append('image', selectedImage);
      }

      const response = await postForm<{ response: string; hasImage: boolean }>('/api/chat', form);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        hasImage: response.hasImage,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save result for learning tools tracking
      saveToolResult('snapSolve', { response: response.response, hasImage: response.hasImage });
      onToolUsed('snapSolve', { message: inputMessage, image: selectedImage }, response);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageSelect(file);
    };
    input.click();
  };

  const openCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleImageSelect(file);
    };
    input.click();
  };

  return (
    <Modal open={currentTool === 'snapSolve'} onClose={closeTool} title="Snap & Solve" className="max-w-4xl w-full mx-4">
      <div className="flex flex-col h-[80vh] max-h-[800px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 rounded-t-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-800 border shadow-lg'
                }`}
              >
                {message.hasImage && message.imageUrl && (
                  <div className="mb-2">
                    <Image
                      src={message.imageUrl}
                      alt="Uploaded"
                      width={200}
                      height={128}
                      className="max-w-full h-32 object-contain rounded"
                    />
                  </div>
                )}
                <div className="whitespace-pre-wrap prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, index) => {
                    // Format mathematical expressions and steps
                    if (line.includes('**') || line.includes('\\[') || line.includes('\\]') || line.includes('\\text{')) {
                      return (
                        <div key={index} className="mb-3">
                          <div dangerouslySetInnerHTML={{ 
                            __html: line
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\\\[(.*?)\\\]/g, '<div className="bg-gray-100 p-4 rounded-lg my-3 font-mono text-center text-sm border">$1</div>')
                              .replace(/\\\((.*?)\\\)/g, '<span className="font-mono bg-gray-50 px-1 rounded">$1</span>')
                              .replace(/\\text\{(.*?)\}/g, '<span className="italic">$1</span>')
                              .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '<span className="font-mono">$1/$2</span>')
                                                              .replace(/\\times/g, '<span className="font-mono">×</span>')
                              .replace(/\\text\{meters\}/g, '<span className="italic">meters</span>')
                              .replace(/\\text\{seconds\}/g, '<span className="italic">seconds</span>')
                              .replace(/\\text\{m\/s\}/g, '<span className="italic">m/s</span>')
                              .replace(/\\text\{km\/hr\}/g, '<span className="italic">km/hr</span>')
                          }} />
                        </div>
                      );
                    }
                    // Format numbered steps
                    if (line.match(/^\d+\./)) {
                      return (
                        <div key={index} className="mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                          <div className="font-semibold text-blue-800 text-base">{line}</div>
                        </div>
                      );
                    }
                    // Format bold text (like "Step 1:", "Step 2:", etc.)
                    if (line.match(/^Step \d+:/)) {
                      return (
                        <div key={index} className="mb-3">
                          <div className="font-bold text-lg text-gray-800">{line}</div>
                        </div>
                      );
                    }
                    // Regular text
                    return <div key={index} className="mb-2 text-gray-700 leading-relaxed">{line}</div>;
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="font-medium">Solving your problem...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t rounded-b-lg">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 relative">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={128}
                className="max-w-full h-32 object-contain rounded-lg border shadow-sm"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Quick Action Buttons */}
          {!selectedImage && (
            <div className="mb-4 flex gap-3">
              <button
                onClick={openCamera}
                className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
              >
                <Camera size={18} />
                Take Photo
              </button>
              <button
                onClick={openFileInput}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors"
              >
                <Upload size={18} />
                Upload Image
              </button>
            </div>
          )}

          {/* Input and Send Button */}
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question, upload an image, or describe what you need help with..."
                className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
              className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 