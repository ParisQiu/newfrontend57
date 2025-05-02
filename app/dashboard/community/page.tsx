import Link from "next/link";

export default function CommunityAllDiscussions() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h1 className="text-2xl font-bold mb-4">All Community Discussions</h1>
      <p className="mb-6 text-gray-600 text-center max-w-xl">
        Sorry, the full discussions page is not available yet.<br />
        Please check back soon for a complete list of active topics, study groups, and more ways to connect with your peers!
      </p>
      <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">
        Go back to Dashboard
      </Link>
    </div>
  );
}
