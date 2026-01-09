'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { ImageUpload } from '../ui/ImageUpload';
import { postForm } from '@/lib/apiClient';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  hasImage?: boolean;
  imageUrl?: string;
}

interface AITutorChatProps {
  showTitle?: boolean;
  contextText?: string;
}

export const AITutorChat = ({ showTitle = true, contextText = '' }: AITutorChatProps) => {
  const { currentTool, closeTool } = useLearningTools();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI tutor. I can help you with any questions, solve problems, or analyze images. What would you like to learn today?'
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
      content: inputMessage.trim() || 'Please analyze this image',
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
      if (contextText) {
        form.append('context', contextText);
      }

      const response = await postForm<{ response: string; hasImage: boolean }>('/api/chat', form);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        hasImage: response.hasImage,
      };

      setMessages(prev => [...prev, assistantMessage]);
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

  return (
    <Modal open={currentTool === 'aiTutorChat'} onClose={closeTool} title={showTitle ? "AI Tutor Chat" : undefined}>
      <div className="flex flex-col h-[600px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border'
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
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t rounded-b-lg">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={96}
                className="max-w-full h-24 object-contain rounded border"
              />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Input and Buttons */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything or upload an image..."
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleImageSelect(file);
                  };
                  input.click();
                }}
                disabled={isLoading}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
              >
                <ImageIcon size={20} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 