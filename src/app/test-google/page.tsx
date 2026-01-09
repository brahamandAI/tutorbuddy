'use client';

import { useEffect, useState } from 'react';

export default function TestGooglePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Page loaded');
    addLog(`Current URL: ${window.location.origin}`);
    addLog(`Google Client ID: ${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`);
    
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      addLog('🔍 Loading Google Identity Services script...');
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        addLog('✅ Google Identity Services script loaded successfully');
        setGoogleLoaded(true);
      };
      
      script.onerror = () => {
        addLog('❌ Failed to load Google Identity Services script');
      };
      
      document.head.appendChild(script);
    };
    
    // Check if Google script is already loaded
    if (window.google) {
      addLog('✅ Google Identity Services already loaded');
      setGoogleLoaded(true);
    } else {
      loadGoogleScript();
    }
  }, []);

  const testGoogleOAuth = () => {
    if (!window.google) {
      addLog('❌ Google not available');
      return;
    }

    addLog('🔍 Testing Google OAuth...');
    
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        callback: (response: any) => {
          addLog(`🔍 OAuth callback received: ${JSON.stringify(response)}`);
          
          if (response.error) {
            addLog(`❌ OAuth error: ${response.error}`);
          } else if (response.access_token) {
            addLog(`✅ Access token received, length: ${response.access_token.length}`);
            testTokenWithAPI(response.access_token);
          }
        },
      });
      
      addLog('🔍 Requesting access token...');
      client.requestAccessToken();
      
    } catch (error) {
      addLog(`❌ OAuth initialization error: ${error}`);
    }
  };

  const testTokenWithAPI = async (accessToken: string) => {
    addLog('🔍 Testing token with API...');
    
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          accessToken: accessToken, 
          role: 'STUDENT' 
        }),
      });
      
      addLog(`🔍 API Response status: ${response.status}`);
      
      const data = await response.json();
      addLog(`🔍 API Response: ${JSON.stringify(data)}`);
      
    } catch (error) {
      addLog(`❌ API Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Google OAuth Test Page</h1>
      
      <div className="mb-4">
        <button 
          onClick={testGoogleOAuth}
          disabled={!googleLoaded}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Test Google OAuth
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Logs:</h2>
        <div className="max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 