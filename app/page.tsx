import Link from "next/link"
import { BookOpen, CheckCircle, Clock, Users, Award, ArrowRight } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-20 text-white md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Study Smarter, Not Harder</h1>
              <p className="text-lg text-blue-100 md:text-xl">
                Boost your academic performance with our AI-powered study assistant. Organize notes, create flashcards,
                track progress, and collaborate with peers.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  href="/signup"
                  className="rounded-lg bg-white px-6 py-3 text-center font-medium text-blue-600 shadow-lg hover:bg-gray-100"
                >
                  Get Started Free
                </Link>
                <Link
                  href="#features"
                  className="rounded-lg border border-white px-6 py-3 text-center font-medium text-white hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative rounded-lg bg-white p-6 shadow-xl">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="StudySmarter Dashboard Preview"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-lg bg-blue-500 p-4 shadow-lg">
                <div className="flex items-center space-x-2 text-white">
                  <Award className="h-8 w-8" />
                  <div>
                    <p className="text-sm font-medium">Trusted by</p>
                    <p className="text-xl font-bold">100,000+ Students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Features Designed for Student Success</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Our platform offers everything you need to excel in your studies, from organization tools to collaborative
              features.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-blue-600" />,
                title: "Smart Notes",
                description:
                  "Create, organize, and search through your notes with our AI-powered system that helps you find information instantly.",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
                title: "Flashcards & Quizzes",
                description:
                  "Generate flashcards from your notes automatically and test your knowledge with adaptive quizzes.",
              },
              {
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                title: "Study Planner",
                description:
                  "Plan your study sessions, set goals, and track your progress with our intuitive study planner.",
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: "Collaborative Learning",
                description: "Share notes, create study groups, and collaborate with classmates in real-time.",
              },
              {
                icon: <Award className="h-8 w-8 text-blue-600" />,
                title: "Performance Analytics",
                description:
                  "Track your progress and identify areas for improvement with detailed performance analytics.",
              },
              {
                icon: <ArrowRight className="h-8 w-8 text-blue-600" />,
                title: "Cross-Platform Access",
                description:
                  "Access your study materials from any device, anywhere, anytime with our cloud-based platform.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">How StudySmarter Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Get started in minutes and transform your study habits
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create an Account",
                description: "Sign up for free and set up your profile with your courses and study goals.",
              },
              {
                step: "02",
                title: "Add Your Study Materials",
                description: "Upload notes, create flashcards, or import content from various sources.",
              },
              {
                step: "03",
                title: "Study Smarter",
                description: "Use our tools to study efficiently, track your progress, and improve your performance.",
              },
            ].map((step, index) => (
              <div key={index} className="relative rounded-lg bg-white p-8 shadow-sm">
                <div className="absolute -top-4 left-8 rounded-full bg-blue-600 px-4 py-2 text-xl font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mb-3 mt-6 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">What Our Users Say</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Join thousands of students who have improved their grades with StudySmarter
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "StudySmarter helped me raise my GPA from 3.2 to 3.8 in just one semester. The flashcard feature is a game-changer!",
                name: "Sarah Johnson",
                role: "Biology Major, University of California",
              },
              {
                quote:
                  "As a medical student, I have tons of information to memorize. StudySmarter's AI-powered notes have made studying so much more efficient.",
                name: "Michael Chen",
                role: "Medical Student, Johns Hopkins University",
              },
              {
                quote:
                  "The collaborative features allowed my study group to work together even when we couldn't meet in person. Highly recommend!",
                name: "Emma Rodriguez",
                role: "Psychology Major, NYU",
              },
            ].map((testimonial, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 text-yellow-400">{"★".repeat(5)}</div>
                <p className="mb-4 text-gray-700">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Frequently Asked Questions</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Find answers to common questions about StudySmarter
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Is StudySmarter free to use?",
                answer:
                  "Yes, StudySmarter offers a free basic plan with essential features. We also offer premium plans with advanced features for power users.",
              },
              {
                question: "Can I access StudySmarter on my mobile device?",
                answer:
                  "StudySmarter is available on web, iOS, and Android, allowing you to study on any device, anywhere.",
              },
              {
                question: "How does the AI-powered note-taking work?",
                answer:
                  "Our AI analyzes your notes to identify key concepts, create summaries, generate flashcards, and suggest related study materials to enhance your learning experience.",
              },
              {
                question: "Can I share my study materials with friends?",
                answer:
                  "Yes, StudySmarter allows you to share notes, flashcards, and other study materials with classmates or study groups.",
              },
              {
                question: "How secure is my data on StudySmarter?",
                answer:
                  "We take data security seriously. All your data is encrypted and stored securely. We never share your personal information with third parties without your consent.",
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-bold text-gray-900">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Transform Your Study Habits?</h2>
          <p className="mb-8 text-lg text-blue-100">
            Join thousands of students who are already studying smarter, not harder.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/signup"
              className="rounded-lg bg-white px-8 py-3 text-center font-medium text-blue-600 shadow-lg hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white px-8 py-3 text-center font-medium text-white hover:bg-white/10"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
