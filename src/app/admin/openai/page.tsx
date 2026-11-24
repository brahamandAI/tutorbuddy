'use client';

import { useEffect, useState } from 'react';

export default function AdminOpenAIPage() {
  const [prefix, setPrefix] = useState('');
  const [source, setSource] = useState('');
  const [configured, setConfigured] = useState(false);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const load = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/openai-key', { credentials: 'include', headers: headers() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Sign in with the admin account to manage the OpenAI key.');
      setLoading(false);
      return;
    }
    setPrefix(data.prefix || '');
    setSource(data.source || 'missing');
    setConfigured(Boolean(data.configured));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/admin/openai-key', {
      method: 'PUT',
      credentials: 'include',
      headers: headers(),
      body: JSON.stringify({ value }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Could not save that key');
    } else {
      setPrefix(data.prefix || '');
      setSource(data.source || 'settings');
      setConfigured(Boolean(data.configured));
      setValue('');
      setMessage('Saved. New AI requests use this key.');
    }
    setSaving(false);
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">OpenAI API key</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Only an admin can open this page. The key in the database is used before the server environment file. Only the first characters are shown.
      </p>
      {loading ? <p className="mt-6 text-sm">Loading…</p> : null}
      {error ? <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-6 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}
      {!loading && !error ? (
        <div className="mt-6 rounded-xl border p-5">
          <p className="text-sm">
            {configured ? (
              <>
                Current <code className="rounded bg-muted px-2 py-1">{prefix}</code>
                {source === 'settings' ? ' · saved in the database' : ' · from the server environment'}
              </>
            ) : (
              'No OpenAI key is set.'
            )}
          </p>
          <label className="mt-4 block text-sm font-medium" htmlFor="openai-key">
            Replacement key
          </label>
          <input
            id="openai-key"
            type="password"
            autoComplete="off"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Paste a new OpenAI key"
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
          <button
            type="button"
            onClick={save}
            disabled={saving || value.trim().length < 8}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Replace key'}
          </button>
        </div>
      ) : null}
    </main>
  );
}
