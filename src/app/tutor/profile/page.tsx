"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Common subjects list
const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Geography',
  'Computer Science',
  'Economics',
  'Business Studies',
  'French',
  'Spanish',
  'Music',
  'Art',
];

export default function TutorProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/tutor/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setBio(data.bio);
      setHourlyRate(data.hourlyRate.toString());
      setSelectedSubjects(data.subjects);
    } catch (error) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/tutor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bio,
          hourlyRate: parseFloat(hourlyRate),
          subjects: selectedSubjects,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          
          {/* Form skeleton */}
          <div className="space-y-6">
            {/* Bio textarea skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/6"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
            
            {/* Hourly rate skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            
            {/* Subjects skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Submit button skeleton */}
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Profile Settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Me
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell students about your teaching experience, qualifications, and teaching style..."
          />
        </div>

        <Input
          type="number"
          min="0"
          step="0.01"
          value={hourlyRate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHourlyRate(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects You Teach
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => toggleSubject(subject)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                  selectedSubjects.includes(subject)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
} 