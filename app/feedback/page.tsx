export default function FeedbackPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Feedback</h1>
      <p className="mb-6">We’d love to hear your thoughts! Please use the form below to submit any feedback or suggestions.</p>
      <form className="space-y-4">
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={6}
          placeholder="Enter your feedback..."
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
    </main>
  );
}
