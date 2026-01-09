"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface TutorProfile {
  id: string;
  user: {
    name: string;
  };
  subjects: string[];
  hourlyRate: number;
  bio: string;
  rating?: number;
  qualifications?: string;
  mode?: string;
  location?: string;
  experience?: string;
  contact?: string;
  languages?: string[];
  profilePicture?: string;
}

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

export default function TutorsPage() {
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await fetch('/api/tutors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch tutors');

      const data = await response.json();
      setTutors(data);
    } catch (error) {
      setError('Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject);
    
    const matchesRate = !maxRate || tutor.hourlyRate <= parseFloat(maxRate);
    
    const matchesRating = !minRating || (tutor.rating && tutor.rating >= parseFloat(minRating));

    return matchesSearch && matchesSubject && matchesRate && matchesRating;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          
          {/* Filters skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded"></div>
            ))}
          </div>
          
          {/* Tutors grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-muted rounded w-16"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Find Your Perfect Tutor
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search by name or description..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="number"
            min="0"
            value={maxRate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxRate(e.target.value)}
            placeholder="Max Rate"
          />

          <Input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={minRating}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinRating(e.target.value)}
            placeholder="Min Rating"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map(tutor => (
          <div
            key={tutor.id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {tutor.user.name}
              </h2>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-gray-600">{tutor.rating ? tutor.rating.toFixed(1) : 'N/A'}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {tutor.bio}
            </p>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map(subject => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">
                ₹{tutor.hourlyRate}/hr
              </span>
              <Link
                href={`/student/tutors/${tutor.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}

        {filteredTutors.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tutors found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
} 