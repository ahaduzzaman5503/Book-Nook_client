"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "../../lib/auth-client";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

const API_URL = "http://localhost:5000";

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [selectedBorrow, setSelectedBorrow] = useState(null);

  // Fetch borrowed books after the session is available.
  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setBorrows([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchBorrows = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/borrows?email=${encodeURIComponent(user.email)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Could not load your borrowed books");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid borrowed books response");
        }

        if (!cancelled) {
          setBorrows(data);
        }
      } catch (error) {
        console.error("Fetch Borrows Error:", error);

        if (!cancelled) {
          toast.error(error.message || "Failed to load borrowed books");
          setBorrows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBorrows();

    return () => {
      cancelled = true;
    };
  }, [user?.email, isPending]);

  // Return a borrowed book.
  const handleReturnBook = async () => {
    if (!selectedBorrow || returningId) return;

    const borrowId = selectedBorrow._id;

    try {
      setReturningId(borrowId);

      const response = await fetch(`${API_URL}/borrows/${borrowId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not return this book");
      }

      setBorrows((previous) =>
        previous.filter((borrow) => borrow._id !== borrowId),
      );

      setSelectedBorrow(null);
      toast.success("Book returned successfully!");
    } catch (error) {
      console.error("Return Book Error:", error);
      toast.error(error.message || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#faf6ef]">
      <Toaster position="top-right" />

      {/* Page Header */}
      <section className="border-b border-[#e5d8c5] bg-[#f5ecde] px-4 py-10 text-center sm:py-12">
        <h1 className="font-serif text-3xl font-bold text-[#24170f] sm:text-4xl">
          My Borrows
        </h1>
        <p className="mt-3 text-sm text-[#796b5e] sm:text-base">
          Books you are reading right now.
        </p>
      </section>

      {/* Borrowed Books Table */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {isPending || loading ? (
          <div className="flex justify-center py-16">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#d8c7ae] border-t-[#315c43]" />
          </div>
        ) : !user?.email ? (
          <div className="rounded-xl border border-[#e5d8c5] bg-[#fffdf9] px-5 py-16 text-center">
            <h2 className="font-serif text-2xl font-semibold text-[#24170f]">
              Login Required
            </h2>
            <p className="mt-2 text-sm text-[#796b5e]">
              Please log in to see your borrowed books.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-lg bg-[#315c43] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#254832]"
            >
              Login
            </Link>
          </div>
        ) : borrows.length === 0 ? (
          <div className="rounded-xl border border-[#e5d8c5] bg-[#fffdf9] px-5 py-16 text-center">
            <h2 className="font-serif text-2xl font-semibold text-[#24170f]">
              No borrowed books yet
            </h2>
            <p className="mt-2 text-sm text-[#796b5e]">
              Explore our library and borrow your first book.
            </p>
            <Link
              href="/books"
              className="mt-6 inline-block rounded-lg bg-[#315c43] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#254832]"
            >
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#e2d3bf] bg-[#fffdf9]">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e2d3bf] text-[#24170f]">
                  <th className="px-2 py-3 font-medium sm:px-4">Image</th>
                  <th className="px-3 py-3 font-medium">Title</th>
                  <th className="px-3 py-3 font-medium">Borrow Date</th>
                  <th className="px-3 py-3 font-medium">Return Date</th>
                  <th className="px-3 py-3 text-right font-medium sm:px-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {borrows.map((borrow) => (
                  <tr
                    key={borrow._id}
                    className="border-b border-[#e2d3bf] last:border-b-0"
                  >
                    <td className="px-2 py-2 sm:px-4">
                      <Image
                        src={borrow.bookImage}
                        alt={borrow.bookTitle || "Book cover"}
                        width={48}
                        height={64}
                        unoptimized
                        className="h-16 w-12 rounded object-cover"
                      />
                    </td>

                    <td className="px-3 py-3 font-medium text-[#24170f]">
                      {borrow.bookTitle}
                    </td>

                    <td className="px-3 py-3 text-[#51463d]">
                      {formatDate(borrow.borrowDate)}
                    </td>

                    <td className="px-3 py-3 text-[#51463d]">
                      {formatDate(borrow.returnDate)}
                    </td>

                    <td className="px-3 py-3 text-right sm:px-4">
                      <button
                        onClick={() => setSelectedBorrow(borrow)}
                        className="rounded-lg border border-[#e2d3bf] px-3 py-1.5 text-sm text-[#24170f] transition hover:bg-[#f5ecde] disabled:opacity-50"
                        disabled={returningId === borrow._id}
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Return Confirmation Modal */}
      {selectedBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-[#fffdf9] p-6 shadow-xl">
            <h2 className="font-serif text-xl font-bold text-[#24170f]">
              Return this book?
            </h2>

            <p className="mt-3 text-sm text-[#796b5e]">
              Are you sure you want to return{" "}
              <span className="font-semibold text-[#24170f]">
                {selectedBorrow.bookTitle}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedBorrow(null)}
                disabled={returningId === selectedBorrow._id}
                className="rounded-lg border border-[#e2d3bf] px-4 py-2 text-sm hover:bg-[#f5ecde]"
              >
                Cancel
              </button>

              <button
                onClick={handleReturnBook}
                disabled={returningId === selectedBorrow._id}
                className="rounded-lg bg-[#315c43] px-4 py-2 text-sm text-white hover:bg-[#254832] disabled:opacity-60"
              >
                {returningId === selectedBorrow._id
                  ? "Returning..."
                  : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
