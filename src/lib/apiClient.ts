type ApiError = { error: string };

export async function postJSON<TReq, TRes>(url: string, body: TReq): Promise<TRes> {
  if (process.env.NEXT_PUBLIC_DEMO === '1') {
    // Demo mode: auto-seed dummy responses
    return seedDemoResponse<TReq, TRes>(url, body);
  }
  
  // Get token from localStorage for authentication
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let msg = 'Unknown error';
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function postForm<TRes>(url: string, form: FormData): Promise<TRes> {
  if (process.env.NEXT_PUBLIC_DEMO === '1') {
    // Demo mode: auto-seed dummy responses
    return seedDemoResponse<any, TRes>(url, Object.fromEntries(form.entries()));
  }
  
  // Get token from localStorage for authentication
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) {
    let msg = 'Unknown error';
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// Demo mode dummy responses
function seedDemoResponse<TReq, TRes>(url: string, body: TReq): TRes {
  switch (url) {
    case '/api/snap-solve':
      return {
        ocrText: 'This is a demo OCR text.',
        steps: ['Step 1: Demo', 'Step 2: Demo'],
        explanation: 'This is a demo explanation.',
      } as any;
    case '/api/explain':
      return {
        explanation: `Demo explanation for "${(body as any).text}" at level ${(body as any).level}.`,
        mediaHints: ['Demo hint 1', 'Demo hint 2'],
      } as any;
    case '/api/micro-quiz':
      return {
        questions: [
          { q: 'Demo Q1?', options: ['A', 'B', 'C'], answerIndex: 0, explain: 'Demo explain 1' },
          { q: 'Demo Q2?', options: ['X', 'Y', 'Z'], answerIndex: 2 },
          { q: 'Demo Q3?', options: ['True', 'False'], answerIndex: 1 },
        ],
      } as any;
    case '/api/doubt-battle/start':
      return {
        id: 'BATTLE123',
        subject: 'Class 10 Science',
        questions: [
          { q: 'What is H2O?', options: ['Water', 'Oxygen', 'Hydrogen'], answerIndex: 0 },
          { q: '2+2=?', options: ['3', '4', '5'], answerIndex: 1 },
        ],
        status: 'pending',
        challenger: 'You',
        opponent: (body as any).friend || 'Friend',
        xp: 0,
      } as any;
    case '/api/doubt-battle/join':
      return {
        id: (body as any).joinCode || 'BATTLE123',
        subject: 'Class 10 Science',
        questions: [
          { q: 'What is H2O?', options: ['Water', 'Oxygen', 'Hydrogen'], answerIndex: 0 },
          { q: '2+2=?', options: ['3', '4', '5'], answerIndex: 1 },
        ],
        status: 'active',
        challenger: 'Friend',
        opponent: 'You',
        xp: 0,
      } as any;
    case '/api/doubt-battle/leaderboard':
      return {
        leaderboard: [
          { user: 'You', xp: 120, wins: 5, streak: 2 },
          { user: 'Friend1', xp: 100, wins: 4, streak: 1 },
          { user: 'Friend2', xp: 80, wins: 3, streak: 1 },
        ],
      } as any;
    default:
      throw new Error('Demo mode: No dummy response for this endpoint');
  }
} 