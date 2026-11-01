import Image from "next/image";

const WhyChooseBookNook = async () => {
  const res = await fetch("http://localhost:5000/featuresdata", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch features");
  }

  const features = await res.json();

  return (
    <section className="bg-[#f8f7f2] py-20 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[3px] text-green-700 font-semibold mb-3">
            The BookNook Experience
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose BookNook?
          </h2>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            More than just a library. A simple place to discover, borrow, and
            enjoy great books.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature._id || index}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                <Image
                  width={500}
                  height={500}
                  src={feature.icon}
                  alt={feature.title}
                  className="w-40 h-40 object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseBookNook;
