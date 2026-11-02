import Link from "next/link";
import BookDetailsContent from "./BookDetailsContent";

const BookDetailsPage = async ({ params }) => {
  const { id } = await params;
  let book = null;

  try {
    const response = await fetch(`http://localhost:5000/books/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      book = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch book:", error);
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
