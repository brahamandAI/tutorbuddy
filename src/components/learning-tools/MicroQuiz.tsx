'use client'

import React, { useState, useEffect } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { TextArea } from '../ui/TextArea';
import { postJSON } from '@/lib/apiClient';

type MicroQuizQuestion = {
  q: string;
  options: string[];
  answerIndex: number;
  explain?: string;
};
type MicroQuizResponse = {
  questions: MicroQuizQuestion[];
};

interface MicroQuizProps {
  showTitle?: boolean;
  contextText?: string;
}

export const MicroQuiz = ({ showTitle = true, contextText = '' }: MicroQuizProps) => {
  const { currentTool, closeTool, selectedText, questionId, saveToolResult, getToolResult, onToolUsed } = useLearningTools();
  const [text, setText] = useState(selectedText);
  const [result, setResult] = useState<MicroQuizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentTool === 'microQuiz') {
      const last = getToolResult('microQuiz');
      if (last) setResult(last);
    }
  }, [currentTool, getToolResult]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = { text, numQ: 3 };
      const res = await postJSON<typeof payload, MicroQuizResponse>('/api/micro-quiz', payload);
      setResult(res);
      saveToolResult('microQuiz', res);
      onToolUsed('microQuiz', payload, res);
    } catch (e: any) {
      setError(e.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={currentTool === 'microQuiz'} onClose={closeTool} title="Micro-Quiz Generator">
      <div className="flex flex-col gap-4">
        <TextArea label="Paste text for quiz" value={text} onChange={setText} rows={3} />
        <button className="bg-blue-600 text-white rounded px-4 py-2 mt-2" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {result && result.questions.length > 0 && (
          <div className="mt-2 space-y-4">
            {result.questions.map((q, i) => (
              <div key={i} className="bg-gray-100 p-2 rounded">
                <div className="font-semibold">Q{i + 1}: {q.q}</div>
                <ul className="list-disc ml-6">
                  {q.options.map((opt, j) => (
                    <li key={j} className={j === q.answerIndex ? 'font-bold text-green-700' : ''}>{opt}</li>
                  ))}
                </ul>
                {q.explain && <div className="text-xs text-gray-600 mt-1">Explanation: {q.explain}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}; 