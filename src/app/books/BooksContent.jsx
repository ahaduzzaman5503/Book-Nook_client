import Image from "next/image";
import Link from "next/link";

const BooksContent = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load books.");
  }

  const books = await response.json();

  return (
    <>
      <p className="mb-6 text-sm font-medium text-gray-600">
        Showing {books.length} books
      </p>

      {books.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#263b32]">
            No books available
          </h2>
          <p className="mt-2 text-gray-500">
            Please check back later for new arrivals.
          </p>
        </div>
      )}

      {books.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-64 overflow-hidden bg-gray-100">
                <Image
                  width={500}
                  height={500}
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                  {book.category}
                </span>

                <h2 className="mt-3 line-clamp-1 text-lg font-bold text-[#263b32]">
                  {book.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  By {book.author}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Available Copies
                  </span>

                  <span className="font-bold text-green-700">
                    {book.availableCopies}
                  </span>
                </div>

                <Link
                  href={`/books/${book._id}`}
                  className="mt-5 block rounded-xl bg-[#263b32] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#385744]"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BooksContent;