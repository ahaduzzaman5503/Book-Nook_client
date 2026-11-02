
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-900">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-semibold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-500">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
