"use client"

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, Video, Star, Users, Shield, Clock, DollarSign } from 'lucide-react'

export default function HowItWorksPage() {
  const steps = [
    {
      id: 1,
      title: "Find Your Perfect Tutor",
      description: "Browse our extensive database of qualified tutors. Filter by subject, experience level, and price range.",
      icon: <Search className="h-8 w-8" />,
      features: ["Search by subject", "Filter by experience", "Compare prices", "Read reviews"]
    },
    {
      id: 2,
      title: "Book Your Session",
      description: "Choose a convenient time slot and book your session. Our flexible scheduling works around your needs.",
      icon: <Calendar className="h-8 w-8" />,
      features: ["Flexible scheduling", "Instant booking", "Calendar integration", "Reminder notifications"]
    },
    {
      id: 3,
      title: "Learn Online",
      description: "Connect with your tutor through our high-quality video platform. Share documents and collaborate in real-time.",
      icon: <Video className="h-8 w-8" />,
      features: ["HD video calls", "Screen sharing", "Document sharing", "Whiteboard tools"]
    },
    {
      id: 4,
      title: "Track Your Progress",
      description: "Monitor your learning progress with detailed reports and feedback from your tutor.",
      icon: <Star className="h-8 w-8" />,
      features: ["Progress tracking", "Session recordings", "Performance reports", "Goal setting"]
    }
  ]

  const benefits = [
    {
      title: "Expert Tutors",
      description: "All our tutors are verified experts with proven teaching experience",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Safe & Secure",
      description: "Your data and payments are protected with bank-level security",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Flexible Scheduling",
      description: "Book sessions at any time, 24/7, to fit your busy schedule",
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: "Affordable Rates",
      description: "Transparent pricing with no hidden fees or long-term commitments",
      icon: <DollarSign className="h-6 w-6" />
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Student",
      content: "TutorBuddy helped me improve my math grades from C to A. My tutor was patient and explained everything clearly.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "College Student",
      content: "The online sessions were so convenient. I could study from anywhere and the quality was excellent.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Parent",
      content: "My daughter's confidence has improved so much since starting with her English tutor. Highly recommend!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How TutorBuddy Works
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Get started with online tutoring in just a few simple steps
          </p>
          <Button size="lg" className="mr-4">
            Find a Tutor
          </Button>
          <Button variant="outline" size="lg">
            Become a Tutor
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Getting Started is Easy
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step.id} className="relative">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose TutorBuddy?
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What Our Students Say
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-sm italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students who have improved their grades with TutorBuddy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Find Your Tutor
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 