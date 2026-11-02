"use client";

export default function BooksError({ error, reset }) {
  return (
    <div className="rounded-xl bg-red-50 p-6 text-center">
      <h2 className="text-xl font-bold text-red-700">
        Unable to load books
      </h2>

      <p className="mt-2 text-gray-600">
        Something went wrong. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-[#263b32] px-5 py-2 text-white"
      >
        Try Again
      </button>
    </div>
  );
}