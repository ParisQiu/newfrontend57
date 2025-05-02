"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const faqs = [
  {
    question: "How do I join a study room?",
    answer: "Go to the Study Rooms section and click 'Join' on the room you wish to enter.",
  },
  {
    question: "How can I reset my password?",
    answer: "In Settings, click 'Change Password' and follow the instructions.",
  },
  {
    question: "Who can I contact for technical support?",
    answer: "Click the 'Contact Support' button below or email support@example.com.",
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setModalOpen(false);
      setSubmitted(false);
      setForm({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto rounded-lg border bg-white dark:bg-gray-900 shadow-sm p-6 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Help Center</h2>
      <input
        className="w-full border rounded px-3 py-2 mb-6 text-black dark:text-white dark:bg-gray-800"
        placeholder="Search for help..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Search FAQs"
      />
      <div>
        {filteredFaqs.length === 0 && (
          <div className="text-gray-500 dark:text-gray-300 mb-4">No results found.</div>
        )}
        {filteredFaqs.map((faq, idx) => (
          <div key={idx} className="mb-4">
            <button
              className="w-full text-left font-medium text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq-answer-${idx}`}
            >
              {faq.question}
            </button>
            {openIndex === idx && (
              <div
                id={`faq-answer-${idx}`}
                className="mt-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded p-3"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center space-x-2">
        <button
          type="button"
          className="flex-1 bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setModalOpen(true)}
        >
          Contact Support
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-100 border border-gray-400 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-500 font-medium px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>

      {/* Contact Support Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Contact Support</h3>
            {submitted ? (
              <div className="text-green-600 dark:text-green-400 text-center">Thank you! Your message has been sent.</div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
                <input
                  className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                />
                <textarea
                  className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  name="message"
                  placeholder="How can we help you?"
                  rows={4}
                  value={form.message}
                  onChange={handleFormChange}
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="flex-1 bg-gray-300 text-black dark:bg-gray-700 dark:text-white font-medium px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
