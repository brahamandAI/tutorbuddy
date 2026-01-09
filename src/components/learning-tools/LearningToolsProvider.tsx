'use client'

import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

// Types
export type LearningToolsUserMeta = {
  classLevel: 'Kid' | 'Class10' | 'Competitive' | 'Meme';
  // Add more user meta fields as needed
};

export type LearningToolsContextType = {
  selectedText: string;
  setSelectedText: (text: string) => void;
  currentTool: string | null;
  openTool: (id: string) => void;
  closeTool: () => void;
  questionId: string | null;
  setQuestionId: (id: string | null) => void;
  userMeta: LearningToolsUserMeta;
  setUserMeta: (meta: LearningToolsUserMeta) => void;
  onToolUsed: (toolId: string, payload?: any, response?: any) => void;
  saveToolResult: (toolId: string, data: any) => void;
  getToolResult: (toolId: string) => any;
  debug: { payloads: any[]; responses: any[] };
};

const LearningToolsContext = createContext<LearningToolsContextType | undefined>(undefined);

export const LearningToolsProvider = ({ children, initialText = '', questionRef = null, initialUserMeta = { classLevel: 'Class10' }, onToolUsed: onToolUsedProp }: {
  children: ReactNode;
  initialText?: string;
  questionRef?: string | null;
  initialUserMeta?: LearningToolsUserMeta;
  onToolUsed?: (toolId: string, payload?: any, response?: any) => void;
}) => {
  const [selectedText, setSelectedText] = useState(initialText);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(questionRef);
  const [userMeta, setUserMeta] = useState<LearningToolsUserMeta>(initialUserMeta);
  const [debugPayloads, setDebugPayloads] = useState<any[]>([]);
  const [debugResponses, setDebugResponses] = useState<any[]>([]);
  const lessonKey = questionId || 'default';

  const openTool = (id: string) => setCurrentTool(id);
  const closeTool = () => setCurrentTool(null);

  // Persist last result in localStorage per lessonId+toolId
  const saveToolResult = (toolId: string, data: any) => {
    try {
      localStorage.setItem(`lt-result-${lessonKey}-${toolId}`, JSON.stringify(data));
    } catch {}
  };
  const getToolResult = (toolId: string) => {
    try {
      const val = localStorage.getItem(`lt-result-${lessonKey}-${toolId}`);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  };

  // Analytics callback
  const onToolUsed = (toolId: string, payload?: any, response?: any) => {
    setDebugPayloads((prev) => [...prev, { toolId, payload, ts: Date.now() }]);
    setDebugResponses((prev) => [...prev, { toolId, response, ts: Date.now() }]);
    if (onToolUsedProp) onToolUsedProp(toolId, payload, response);
  };

  return (
    <LearningToolsContext.Provider value={{ selectedText, setSelectedText, currentTool, openTool, closeTool, questionId, setQuestionId, userMeta, setUserMeta, onToolUsed, saveToolResult, getToolResult, debug: { payloads: debugPayloads, responses: debugResponses } }}>
      {children}
    </LearningToolsContext.Provider>
  );
};

export function useLearningTools() {
  const ctx = useContext(LearningToolsContext);
  if (!ctx) throw new Error('useLearningTools must be used within LearningToolsProvider');
  return ctx;
}

export function openTool(id: string) {
  const ctx = useContext(LearningToolsContext);
  if (!ctx) throw new Error('openTool must be used within LearningToolsProvider');
  ctx.openTool(id);
}

export function closeTool() {
  const ctx = useContext(LearningToolsContext);
  if (!ctx) throw new Error('closeTool must be used within LearningToolsProvider');
  ctx.closeTool();
}

// Debug panel (dev only)
export const LearningToolsDebugPanel = () => {
  const { debug } = useLearningTools();
  if (process.env.NODE_ENV !== 'development') return null;
  return (
    <div className="fixed bottom-0 left-0 w-full max-h-64 overflow-y-auto bg-black bg-opacity-80 text-white text-xs z-[9999] p-2">
      <div className="font-bold mb-1">LearningTools Debug Panel</div>
      <div className="flex gap-4">
        <div>
          <div className="underline">Payloads</div>
          <pre>{JSON.stringify(debug.payloads, null, 2)}</pre>
        </div>
        <div>
          <div className="underline">Responses</div>
          <pre>{JSON.stringify(debug.responses, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}; 