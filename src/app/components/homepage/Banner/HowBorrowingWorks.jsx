const HowBorrowingWorks = () => {
  const steps = [
    {
      number: "01",
      icon: "📚",
      title: "Explore Books",
      description:
        "Browse our collection and discover books that match your interests.",
    },
    {
      number: "02",
      icon: "📖",
      title: "Borrow Your Book",
      description:
        "Choose your favorite book and confirm your borrowing request.",
    },
    {
      number: "03",
      icon: "🔄",
      title: "Return & Repeat",
      description:
        "Enjoy reading, return your book on time, and discover your next favorite.",
    },
  ];

  return (
    <section className="bg-white py-20 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[3px] text-green-700 font-semibold mb-3">
            Simple & Easy
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How Borrowing Works
          </h2>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Getting your next favorite book is easy. Follow these three simple
            steps and start reading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#f8f7f2] rounded-2xl p-8 text-center hover:shadow-lg transition duration-300"
            >
              <span className="text-5xl">{step.icon}</span>

              <p className="text-green-700 font-bold text-sm mt-5">
                STEP {step.number}
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/all_books"
            className="inline-block bg-green-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition"
          >
            Explore Books
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowBorrowingWorks;
