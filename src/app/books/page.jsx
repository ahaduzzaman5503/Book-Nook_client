import { Suspense } from "react";
import BooksContent from "./BooksContent";

const AllBooksPage = () => {
  return (
    <section className="min-h-screen bg-[#f8f7f3] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
            BOOKNOOK LIBRARY
          </span>

          <h1 className="mt-5 text-3xl font-bold text-[#263b32] sm:text-4xl">
            Explore All Books
          </h1>

          <p className="mt-3 text-gray-600">
            Discover your next favorite story from our collection.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-10 text-center text-gray-600">
              Loading books...
            </div>
          }
        >
          <BooksContent />
        </Suspense>
      </div>
    </section>
  );
};

export default AllBooksPage;
