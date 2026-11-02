import { Suspense } from "react";
import Link from "next/link";
import BookDetailsContent from "./BookDetailsContent";

const BookDetailsPage = ({ params }) => {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-[#f8f7f3]">
          <p className="text-lg font-medium text-[#263b32]">
            Loading book details...
          </p>
        </main>
      }
    >
      <BookDetailsData params={params} />
    </Suspense>
  );
};

const BookDetailsData = async ({ params }) => {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
    {
      cache: "no-store",
    }
  );

  let book = null;

  if (response.ok) {
    book = await response.json();
  }

  if (!book) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f8f7f3] px-4">
        <div className="text-center">
          <p className="text-5xl">📚</p>

          <h1 className="mt-4 text-2xl font-bold text-[#263b32]">
            Book Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            This book may have been removed or does not exist.
          </p>

          <Link
            href="/books"
            className="mt-6 inline-block rounded-xl bg-[#263b32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#385744]"
          >
            Browse Books
          </Link>
        </div>
      </main>
    );
  }

  return <BookDetailsContent book={book} />;
};

export default BookDetailsPage;
