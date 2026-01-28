"use client";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-12">
      {/* TOP HERO HEADER (CENTERED, ONE LINE) */}
      <div className="mb-10 text-center">
        <h1 className="text-center text-5xl font-extrabold leading-[1.05] tracking-tight sm:whitespace-nowrap sm:text-7xl md:text-8xl">
          <span className="rainbow-text">Promote Your Meme Coin</span>
        </h1>

        <p className="mt-6 text-5xl font-bold text-white/80">+</p>

        <p className="mx-auto mt-5 max-w-3xl text-xl leading-snug sm:text-2xl">
          <span className="text-white/85">
            Get a full promotion and visibilty
          </span>{" "}
          <span className="text-yellow-300 font-semibold">
            in two simple steps
          </span>
          <span className="text-white/85">.</span>{" "}
          <span className="text-white/85">Pay once and</span>{" "}
          <span className="text-green-400 font-semibold">
            start promoting immediately
          </span>
          <span className="text-white/85">.</span>
        </p>

        <div className="mt-10 flex flex-nowrap items-center justify-center gap-4">
          <span className="inline-flex shrink-0 items-center rounded-2xl border-2 border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white/90 backdrop-blur-xl sm:px-7 sm:py-3.5 sm:text-sm">
            <span className="mr-3 text-green-400 text-base font-extrabold sm:mr-4">
              2
            </span>
            Easy Steps
          </span>

          <span className="inline-flex shrink-0 items-center rounded-2xl border-2 border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white/90 backdrop-blur-xl sm:px-7 sm:py-3.5 sm:text-sm">
            <span className="mr-3 text-yellow-300 text-base font-extrabold">
              $15
            </span>
            Flat Rate
          </span>
        </div>
      </div>

      {/* BORDERED GLASS CARD */}
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_30px_120px_-70px_rgba(0,0,0,0.55)] sm:p-10">
        <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
          <span className="rainbow-text">Promote Your Coin</span>
        </h2>

        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center rounded-full border-2 border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-green-300/90">
            SOLANA
          </span>
        </div>

        <div className="mt-8">
          <label className="block text-base font-semibold text-white/85">
            Token Address
          </label>

          <input
            type="text"
            placeholder="Enter your token contract address..."
            className="mt-4 w-full rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base text-white/90 placeholder:text-white/40 outline-none transition focus:border-white/30"
          />

          <p className="mt-4 text-sm leading-relaxed">
            <span className="mr-2">ℹ️</span>
            <span className="text-white/70">
              This will be displayed on your{" "}
            </span>
            <span className="text-yellow-300 font-semibold">
              promotion page
            </span>
            <span className="text-white/70"> for </span>
            <span className="text-green-400 font-semibold">
              maximum visibility
            </span>
            <span className="text-white/70">.</span>
          </p>

          <button
            type="button"
            className="mt-6 w-full rounded-2xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:opacity-90"
          >
            Connect Wallet to Promote
          </button>

          <div className="mt-4 text-center text-sm">
            <span className="text-white/70">Fee:</span>{" "}
            <span className="text-green-400 font-semibold">~0.1 SOL</span>{" "}
          </div>
        </div>
      </div>
    </section>
  );
}
