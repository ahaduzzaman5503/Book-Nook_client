"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const API_URL = "http://localhost:5000";

const MyBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!user?.email) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/my-books?email=${encodeURIComponent(user.email)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Could not load your books");
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Fetch My Books Error:", error);
        toast.error(error.message || "Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user?.email, isPending]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const updatedBook = {
      title: form.elements.title.value.trim(),
      author: form.elements.author.value.trim(),
      category: form.elements.category.value,
      image: form.elements.image.value.trim(),
      description: form.elements.description.value.trim(),
      totalCopies: Number(form.elements.totalCopies.value),
    };

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/books/${editingBook._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update book");
      }

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book._id === editingBook._id
            ? {
                ...book,
                ...updatedBook,
                availableCopies:
                  updatedBook.totalCopies -
                  (Number(book.totalCopies) - Number(book.availableCopies)),
              }
            : book,
        ),
      );

      setEditingBook(null);
      toast.success("Book updated successfully!");
    } catch (error) {
      console.error("Update Book Error:", error);
      toast.error(error.message || "Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBook) return;

    try {
      setDeleting(true);

      const response = await fetch(`${API_URL}/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete book");
      }

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== deletingBook._id),
      );

      setDeletingBook(null);
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Delete Book Error:", error);
      toast.error(error.message || "Failed to delete book");
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f0]">
        <p className="text-lg font-medium text-[#263b32]">
          Loading your books...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f0] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#263b32]">Please log in</h1>

          <p className="mt-2 text-gray-600">
            Log in to manage the books you added.
          </p>

          <Link
            href="/login"
            className="mt-5 inline-block rounded-lg bg-[#263b32] px-6 py-3 text-white hover:bg-[#385744]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] pb-16">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#e8f8ee",
              color: "#079447",
            },
          },
          error: {
            style: {
              background: "#fff0f0",
              color: "#dc2626",
            },
          },
        }}
      />

      <section className="border-b border-[#e5d9c8] bg-[#f4ecdf] px-4 py-10 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#211b16] sm:text-4xl">
          My Books
        </h1>

        <p className="mt-3 text-[#76675b]">Books you added to the library.</p>
      </section>

      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        {books.length === 0 ? (
          <div className="rounded-xl border border-[#e5d9c8] bg-[#fffdf9] px-6 py-12 text-center">
            <p className="text-4xl">📚</p>

            <h2 className="mt-4 text-xl font-semibold text-[#263b32]">
              You have not added any books yet.
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Start building your personal library today.
            </p>

            <Link
              href="/add_book"
              className="mt-5 inline-block rounded-lg bg-[#263b32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#385744]"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#e3d5c2] bg-[#fffdf9]">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#e3d5c2] text-[#30271f]">
                  <th className="px-2 py-3 font-medium sm:px-4">Book</th>

                  <th className="px-3 py-3 font-medium">Category</th>

                  <th className="px-3 py-3 font-medium">Copies</th>

                  <th className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="border-b border-[#e3d5c2] last:border-b-0"
                  >
                    <td className="px-2 py-2 sm:px-4">
                      <div className="flex items-center gap-3">
                        <Image
                          width={500}
                          height={500}
                          src={book.image}
                          alt={book.title}
                          className="h-16 w-12 rounded object-cover"
                        />

                        <div>
                          <p className="font-medium text-[#211b16]">
                            {book.title}
                          </p>

                          <p className="mt-1 text-[#927b68]">{book.author}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="rounded-full bg-[#f1e6d5] px-3 py-1 text-xs text-[#493b2e]">
                        {book.category}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-[#30271f]">
                      {book.totalCopies}
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingBook(book)}
                          className="rounded-md border border-[#e3d5c2] px-3 py-1.5 text-xs font-medium text-[#30271f] hover:bg-[#f4ecdf]"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeletingBook(book)}
                          className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-6 w-full max-w-lg rounded-xl bg-[#fffdf9] p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold text-[#263b32]">
              Edit Book
            </h2>
            <form
              key={editingBook._id}
              onSubmit={handleUpdate}
              className="space-y-3"
            >
              <input
                name="title"
                defaultValue={editingBook.title}
                placeholder="Book title"
                required
                className="w-full rounded-lg border border-[#e3d5c2] px-3 py-2.5 outline-none focus:border-[#526e59]"
              />

              <input
                name="author"
                defaultValue={editingBook.author}
                placeholder="Author"
                required
                className="w-full rounded-lg border border-[#e3d5c2] px-3 py-2.5 outline-none focus:border-[#526e59]"
              />

              <select
                name="category"
                defaultValue={editingBook.category}
                required
                className="w-full rounded-lg border border-[#e3d5c2] bg-white px-3 py-2.5"
              >
                {["Fiction", "Science", "History", "Kids", "Others"].map(
                  (category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ),
                )}
              </select>

              <input
                name="totalCopies"
                type="number"
                min="1"
                defaultValue={editingBook.totalCopies}
                required
                placeholder="Total copies"
                className="w-full rounded-lg border border-[#e3d5c2] px-3 py-2.5"
              />

              <input
                name="image"
                type="url"
                defaultValue={editingBook.image}
                required
                placeholder="Image URL"
                className="w-full rounded-lg border border-[#e3d5c2] px-3 py-2.5"
              />

              <textarea
                name="description"
                defaultValue={editingBook.description}
                required
                rows="4"
                placeholder="Book description"
                className="w-full rounded-lg border border-[#e3d5c2] px-3 py-2.5"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={saving}
                  className="rounded-lg border border-[#e3d5c2] px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#263b32] px-5 py-2 text-sm font-semibold text-white hover:bg-[#385744] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#fffdf9] p-6 text-center shadow-xl">
            <p className="text-4xl">🗑️</p>

            <h2 className="mt-3 text-xl font-bold text-[#263b32]">
              Delete this book?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete "{deletingBook.title}"? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setDeletingBook(null)}
                disabled={deleting}
                className="rounded-lg border border-[#e3d5c2] px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MyBooksPage;
