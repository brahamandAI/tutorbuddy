"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  GraduationCap,
  Heart,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  Video,
  Calendar,
  TrendingUp,
  Sparkles,
  MapPin,
  Brain,
  Smartphone,
  Monitor,
  BookMarked,
  Lightbulb,
  Mic,
  Volume2,
  VolumeX,
  Languages,
  Bot,
  UserCheck,
  Clock4,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react'

import { useAuthPopup } from '@/hooks/useAuthPopup';
import { useAuth } from '@/contexts/AuthContext';
import BrainstormBubbles from '@/components/BrainstormBubbles';
import CourseLevels from '@/components/CourseLevels';

// Only one welcome-page video plays at a time.
const videoPlayListeners = new Set<(id: number) => void>();
let nextVideoId = 0;

// Custom Video Component with Controls
function VideoWithControls({ src, className = "" }: { src: string; className?: string }) {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const idRef = useRef(0);
  const mutedRef = useRef(false);

  if (idRef.current === 0) {
    idRef.current = ++nextVideoId;
  }

  useEffect(() => {
    const id = idRef.current;
    const pauseIfAnotherPlays = (playingId: number) => {
      if (playingId !== id) {
        videoRef.current?.pause();
      }
    };
    videoPlayListeners.add(pauseIfAnotherPlays);
    return () => {
      videoPlayListeners.delete(pauseIfAnotherPlays);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.muted = mutedRef.current;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.5 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const notifyPlaying = () => {
    videoPlayListeners.forEach((listener) => listener(idRef.current));
  };

  const toggleMute = () => {
    if (videoRef.current) {
      mutedRef.current = !isMuted;
      videoRef.current.muted = mutedRef.current;
      setIsMuted(mutedRef.current);
    }
  };

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        muted={isMuted}
        loop
        playsInline
        className={className}
        onPlay={() => notifyPlaying()}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="text-white hover:text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { openPopup } = useAuthPopup();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'STUDENT') {
        router.push('/student/dashboard');
      } else if (user.role === 'TUTOR') {
        router.push('/tutor/dashboard');
      } else {
        router.push('/dashboard'); // fallback
      }
    }
  }, [isAuthenticated, user, router]);

  // Show loading or return null while redirecting
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }
  
  const delhiLocations = [
    { name: "Lajpat Nagar", students: 150, tutors: 25, rating: 4.8 },
    { name: "Rohini", students: 120, tutors: 20, rating: 4.7 },
    { name: "Dwarka", students: 180, tutors: 30, rating: 4.9 },
    { name: "Saket", students: 90, tutors: 15, rating: 4.6 },
    { name: "Pitampura", students: 110, tutors: 18, rating: 4.5 },
    { name: "Janakpuri", students: 95, tutors: 16, rating: 4.7 }
  ]

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Learning",
      description: "Personalized learning paths with AI recommendations and smart assessments"
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Online & Offline",
      description: "Flexible learning modes - attend classes online or meet tutors in Delhi"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Support",
      description: "Multilingual voice support in Indian languages for better understanding"
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Teaching Assistant",
      description: "24/7 AI chatbot for instant doubt resolution and course guidance"
    }
  ]

  const stats = [
    { number: "50,000+", label: "Students Enrolled" },
    { number: "2,000+", label: "Expert Tutors" },
    { number: "100+", label: "Delhi Locations" },
    { number: "95%", label: "Success Rate" }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Class 10 Student",
      avatar: "/avatars/priya.jpg",
      content: "The AI-powered learning helped me understand complex topics easily. My grades improved from 65% to 92%!",
      rating: 5,
      subject: "Mathematics & Science",
      location: "Lajpat Nagar"
    },
    {
      name: "Rahul Kumar",
      role: "JEE Aspirant",
      avatar: "/avatars/rahul.jpg",
      content: "The competitive exam preparation with AI assistance is amazing. Cleared my doubts instantly!",
      rating: 5,
      subject: "Physics & Chemistry",
      location: "Dwarka"
    },
    {
      name: "Mrs. Mehta",
      role: "Parent",
      avatar: "/avatars/mehta.jpg",
      content: "My daughter's confidence has improved tremendously. The offline sessions in Saket are very convenient.",
      rating: 5,
      subject: "English & Hindi",
      location: "Saket"
    }
  ]

  return (
      <div className="min-h-screen bg-background">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.07] via-background to-brand-primary-end/[0.06]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative px-6 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                {/* Content Side */}
                <div className="text-center lg:text-left">
                  <div className="mb-3 flex items-center justify-center lg:justify-start">
                    <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                      <Sparkles className="h-4 w-4 mr-2" />
                      #1 AI-Powered Learning Platform
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Smart Teaching. Smarter Students
                    <br />
                    <span className="gradient-text">Fueling Futures with AI</span>
                  </h1>
                  
                  <p className="mt-3 text-base leading-6 text-muted-foreground lg:max-w-lg">
                    Experience personalized learning with AI assistance. Choose from online classes or offline sessions 
                    across Delhi. Expert tutors, smart recommendations, and voice support in Indian languages.
                  </p>
                  
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 flex-wrap">
                    <Button
                      size="lg"
                      className="px-8 py-3 text-lg shadow-md bg-gradient-to-r from-primary to-brand-primary-end hover:opacity-95"
                      onClick={() => openPopup('register', 'STUDENT')}
                    >
                      <UserCheck className="mr-2 h-5 w-5" />
                      Register as Student
                    </Button>
                    <Button variant="secondary" size="lg" className="px-8 py-3 text-lg" onClick={() => openPopup('register', 'TUTOR')}>
                      <GraduationCap className="mr-2 h-5 w-5" />
                      Register as Tutor
                    </Button>
                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-border/80" asChild>
                      <Link href="/courses">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Explore Courses
                      </Link>
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-foreground">{stat.number}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                                {/* Video Side */}
                <div className="relative -mt-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <VideoWithControls 
                      src="/video/hero-video.mp4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating elements around video */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brainstorm Bubbles Section */}
        <BrainstormBubbles />

        {/* Features Section */}
        <section className="py-24 px-6 sm:px-6 lg:px-8 bg-muted/25 border-y border-border/60">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose Our Platform?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Advanced AI technology meets traditional learning excellence
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-8 sm:px-6 lg:px-8 bg-muted/25">
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <VideoWithControls
                  src="/video/footer-video.mp4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </section>

        <CourseLevels />

        <section className="px-6 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <VideoWithControls
                  src="/video/footer-video2.mp4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </section>

        {/* Delhi Offline Locations Section */}
        <section className="py-24 px-6 sm:px-6 lg:px-8 bg-muted/20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Offline Meet Locations in Delhi
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Convenient locations across Delhi for in-person learning sessions
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {delhiLocations.map((location, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{location.name}</h3>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>{location.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">{location.students}</div>
                        <div className="text-muted-foreground">Students</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">{location.tutors}</div>
                        <div className="text-muted-foreground">Tutors</div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" size="sm" asChild>
                      <Link href="/offline-meet">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Session
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
                </div>
        </section>

        {/* AI Chatbot Section */}
        <section className="py-24 px-6 sm:px-6 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                  Meet ब्रह्मांड Ai - Your Learning Assistant
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Get instant answers to your questions, personalized course recommendations, and 24/7 learning support. 
                  Our AI assistant supports multiple Indian languages and voice interactions.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Instant doubt resolution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Personalized course recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Voice support in Indian languages</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>24/7 learning assistance</span>
                </div>
                </div>
                
                <Button className="mt-8" size="lg" asChild>
                  <Link href="/ai-teaching">
                    <Bot className="mr-2 h-5 w-5" />
                    Start Chatting with AI
                  </Link>
                </Button>
              </div>
              
              <div className="relative">
                <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/[0.08] to-brand-primary-end/[0.06] p-8 shadow-md">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">ब्रह्मांड Ai</h3>
                      <p className="text-sm text-muted-foreground">Online • Learning Assistant</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-background rounded-lg p-4">
                      <p className="text-sm">Hello! I'm here to help you with your studies. What would you like to learn today?</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mic className="mr-2 h-4 w-4" />
                        Voice
                      </Button>
                      <Button size="sm" variant="outline">
                        <Languages className="mr-2 h-4 w-4" />
                        हिंदी
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Courses
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                What Our Students Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Real stories from students across Delhi
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">
                            {testimonial.subject}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {testimonial.location}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-primary/[0.08] via-muted/40 to-brand-primary-end/[0.08] p-10 sm:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already learning smart with AI. 
                Choose your preferred mode - online or offline sessions in Delhi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="px-8 py-3 text-lg shadow-md bg-gradient-to-r from-primary to-brand-primary-end hover:opacity-95" onClick={() => openPopup('register', 'STUDENT')}>
                  <UserCheck className="mr-2 h-5 w-5" />
                  Register as Student
                </Button>
                <Button variant="secondary" size="lg" className="px-8 py-3 text-lg" onClick={() => openPopup('register', 'TUTOR')}>
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Become a Tutor
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section with Video */}
        <footer className="bg-muted/30 py-16 px-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Join Our Community
                  </Badge>
                </div>
                
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                  Experience the Future of Learning
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Watch how our AI-powered platform transforms education. See real students 
                  learning with personalized assistance and smart recommendations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="px-8 py-3 text-lg" onClick={() => openPopup('register', 'STUDENT')}>
                    <UserCheck className="mr-2 h-5 w-5" />
                    Start Learning Today
                  </Button>
                  <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
                    <Link href="/contact">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contact Us
                    </Link>
                  </Button>
                </div>

                {/* Footer Stats */}
                <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">24/7</div>
                    <div className="text-sm text-muted-foreground">AI Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">100+</div>
                    <div className="text-sm text-muted-foreground">Delhi Locations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">95%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">50K+</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Platform</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link></li>
                    <li><Link href="/tutors" className="hover:text-foreground transition-colors">Find Tutors</Link></li>
                    <li><Link href="/subjects" className="hover:text-foreground transition-colors">Subjects</Link></li>
                    <li><Link href="/ai-teaching" className="hover:text-foreground transition-colors">AI Assistant</Link></li>
                    <li><Link href="/jee" className="hover:text-foreground transition-colors">JEE Syllabus</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Support</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                    <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                    <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                    <li><Link href="/feedback" className="hover:text-foreground transition-colors">Feedback</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Company</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                    <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                    <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                    <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Connect</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                    <li><Link href="/newsletter" className="hover:text-foreground transition-colors">Newsletter</Link></li>
                    <li><Link href="/social" className="hover:text-foreground transition-colors">Social Media</Link></li>
                    <li><Link href="/partners" className="hover:text-foreground transition-colors">Partners</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                <p>&copy; 2024 Tutor Buddy. All rights reserved. | Powered by AI for better learning.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
  )
} 