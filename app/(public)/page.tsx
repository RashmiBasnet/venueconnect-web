import Link from "next/link";
import Image from "next/image";
import HowItWorks from "./_components/HowItWorks";

export default function Home() {
  const packages = [
    {
      title: "Birthday Celebration",
      desc: "Make birthdays special with perfect party venue.",
      img: "/images/packages/HappyB.png",
    },
    {
      title: "Wedding/Engagement",
      desc: "A complete venue package for elegant wedding or engagement ceremonies.",
      img: "/images/packages/wedding.png",
    },
    {
      title: "Out Door Party",
      desc: "Celebrate in the open air with a perfect garden or terrace setup.",
      img: "/images/packages/outdoorparty.png",
    },
    {
      title: "Kids Party",
      desc: "A fun-filled venue designed specially for children's celebration..",
      img: "/images/packages/kidsparty.png",
    },
  ];

  const venues = [
    {
      title: "Lord Palace Banquet",
      address: "P8VC+7WJ, Tokha Rd,\nKathmandu 44600",
      img: "/images/venues/lordpalace.png",
    },
    {
      title: "Dhumrabargha Venue",
      address: "Handigaun Marg,\nKathmandu 44600",
      img: "/images/venues/dhumrabaraha.png",
    },
    {
      title: "Crystal Banquet",
      address: "M8C8+584, Lalitpur\n44600",
      img: "/images/venues/crystal.png",
    },
    {
      title: "Silver Oak Party Palace",
      address: "Between PM Road and\nTukucha Marg,\nKathmandu 44600",
      img: "/images/venues/silveroak.png",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#233041]">
      {/* Hero */}
      <section className="bg-white -mt-10">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              The Perfect Venue, Just For You.
            </h1>
            <p className="mt-2 text-lg font-semibold text-[#233041]/80">
              “From small gatherings to big celebrations.”
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mt-7 max-w-3xl">
            <div className="flex items-center gap-3 rounded-xl border border-[#233041]/15 bg-white px-4 py-3 shadow-sm">
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#233041]/45"
                placeholder="Find Venues, Packages..."
              />
              <button
                aria-label="Search"
                className="grid h-9 w-9 place-items-center rounded-lg bg-[#233041]/5 hover:bg-[#233041]/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16.5 16.5 21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Packages */}
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Packages</h2>
          <Link
            href="/packages"
            className="text-sm font-medium text-[#233041]/55 hover:text-[#233041]"
          >
            See All <span className="ml-1">›</span>
          </Link>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <Link
              key={p.title}
              href="/packages"
              className="group rounded-2xl border border-[#233041]/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#F2EFEA]">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold">{p.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#233041]/55">
                {p.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Venues */}
        <div className="mt-12 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Venues</h2>
          <Link
            href="/venues"
            className="text-sm font-medium text-[#233041]/55 hover:text-[#233041]"
          >
            See All <span className="ml-1">›</span>
          </Link>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {venues.map((v) => (
            <Link
              key={v.title}
              href="/venues"
              className="group rounded-2xl border border-[#233041]/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-[#EDE7E1]">
                <Image
                  src={v.img}
                  alt={v.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold">{v.title}</h3>
                <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#233041]/55">
                  {v.address}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* How it works */}
        <HowItWorks />
      </section>
    </main>
  );
}
