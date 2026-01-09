"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  Clock, 
  Globe,
  MessageCircle,
  FileText,
  User,
  Building,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Mail as MailIcon,
  Calendar,
  Star
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const inquiryTypes = [
    'General Inquiry',
    'Course Information',
    'Student Registration',
    'Tutor Registration',
    'Technical Support',
    'AI Features',
    'Offline Sessions',
    'Other'
  ]

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+91 90900 20245"],
      color: "text-blue-600"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["info@therobostrix.com"],
      color: "text-green-600"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office",
      details: ["Delhi, India", "Available across Delhi NCR"],
      color: "text-purple-600"
    }
  ]

  const delhiOffices = [
    {
      name: "Lajpat Nagar Center",
      address: "Shop No. 15, Lajpat Nagar Central Market, New Delhi - 110024",
      phone: "+91 90900 20245",
      hours: "Mon-Sat: 9:00 AM - 8:00 PM"
    },
    {
      name: "Dwarka Center",
      address: "Plot No. 8, Sector 12, Dwarka, New Delhi - 110078",
      phone: "+91 90900 20245",
      hours: "Mon-Sat: 9:00 AM - 8:00 PM"
    },
    {
      name: "Saket Center",
      address: "Shop No. 22, Saket District Center, New Delhi - 110017",
      phone: "+91 90900 20245",
      hours: "Mon-Sat: 9:00 AM - 8:00 PM"
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      // Handle form submission logic here
      console.log('Form submitted:', formData)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get in touch with us for any questions about our AI-powered learning platform, 
            course information, or to schedule a consultation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief subject of your inquiry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground min-h-[120px] resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
                <CardDescription>Reach us through multiple channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-muted ${info.color}`}>
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{info.title}</h4>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
                <CardDescription>When you can reach us</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Saturday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sunday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delhi Offices */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Delhi Offices</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {delhiOffices.map((office, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-primary" />
                    <span>{office.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground">{office.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{office.phone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{office.hours}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                question: "How does the AI-powered learning work?",
                answer: "Our AI analyzes your learning patterns and creates personalized study plans with adaptive content and smart assessments."
              },
              {
                question: "Can I choose between online and offline sessions?",
                answer: "Yes! You can choose online virtual classes, offline in-person sessions, or a hybrid approach based on your preference."
              },
              {
                question: "What subjects do you cover?",
                answer: "We cover all major subjects from Kindergarten to Competitive Exams including Mathematics, Science, English, and more."
              },
              {
                question: "How do I get started as a student?",
                answer: "Simply register on our platform, choose your subjects and learning mode, and we'll match you with the perfect tutor."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 