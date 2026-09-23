export default function Hero() {
  return (
    <section className="relative flex h-screen items-center justify-center px-4 text-center">

      <div className="max-w-4xl">

        {/* 🟣 TITLE — Yeseva */}
        <h1 className="font-yeseva text-5xl md:text-7xl lg:text-8xl tracking-wide drop-shadow-2xl">
          Thr-fited.
        </h1>
        <h1 className="font-roboto text-5xl md:text-7xl lg:text-8xl tracking-wide drop-shadow-2xl">
          Reimagined.
        </h1>

        {/* ⚪ BODY — Roboto (default) */}
        <p className="mt-6 text-lg md:text-xl opacity-90">
          Discover unique fashion finds and give clothing a second life.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/marketplace"
            className="rounded-xl bg-white px-6 py-3 text-black font-medium transition hover:scale-105 hover:bg-transparent hover:text-white border border-white"
          >
            Browse Marketplace
          </a>

          <a
            href="/create"
            className="rounded-xl bg-transparent px-6 py-3 text-white font-medium transition hover:scale-105 hover:bg-white hover:text-black border border-white"
          >
            Start Selling
          </a>
        </div>

      </div>
    </section>
  );
}