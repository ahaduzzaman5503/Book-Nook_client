import Image from "next/image";
import Link from "next/link";

const AllBooks = async () => {
  const res = await fetch("http://localhost:5000/books", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch new arrivals");
  }

  const books = await res.json();

  return (
    <section className="bg-[#f8f7f2] py-16 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <p className="text-sm uppercase tracking-[3px] text-green-700 font-semibold mb-2">
              Fresh from our shelves
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              New Arrivals
            </h2>

            <p className="text-gray-600 mt-2">
              Discover the latest additions to our library.
            </p>
          </div>

          <Link
            href="/"
            className="border border-green-800 text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-800 hover:text-white transition"
          >
            Back to Home →
          </Link>
        </div>

        {books.length === 0 ? (
          <p className="text-center py-12 text-gray-600">
            No books available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
              >
                <Image
                  width={500}
                  height={500}
                  src={book.image}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {book.category}
                  </span>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {book.title}
                  </h3>

                  <p className="text-gray-600 mb-5">By {book.author}</p>

                  <Link
                    href={`/books/${book._id}`}
                    className="block text-center bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AllBooks;
