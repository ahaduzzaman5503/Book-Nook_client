"use client";

export default function BookDetailsError({ reset }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f7f3] px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#263b32]">
          Something went wrong!
        </h2>

        <p className="mt-2 text-gray-500">
          Unable to load book details.
        </p>

        <button
          onClick={() => reset()}
          className="mt-5 rounded-xl bg-[#263b32] px-6 py-3 text-white"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}