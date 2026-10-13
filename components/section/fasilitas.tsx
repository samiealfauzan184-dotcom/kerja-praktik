"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Monitor,
  Pause,
  Play,
  Sprout,
  Trophy,
  Wifi,
} from "lucide-react";

// Sesuaikan daftar ini dengan fasilitas yang benar-benar ada.
// Isi `image` dengan path foto, misalnya "/fasilitas/lab-tkj.jpg"
const fasilitas = [
  {
    icon: Monitor,
    title: "Laboratorium Komputer",
    desc: "Ruang praktik jurusan TKJ dengan perangkat komputer untuk pembelajaran berbasis proyek.",
    image: "",
  },
  {
    icon: Wifi,
    title: "Jaringan & Internet",
    desc: "Akses internet untuk menunjang pembelajaran dan praktik jaringan.",
    image: "",
  },
  {
    icon: Sprout,
    title: "Lahan Praktik Pertanian",
    desc: "Area praktik langsung bagi siswa untuk belajar budidaya dan agribisnis.",
    image: "",
  },
  {
    icon: BookOpen,
    title: "Perpustakaan",
    desc: "Ruang baca yang nyaman dengan koleksi buku pelajaran dan referensi.",
    image: "",
  },
  {
    icon: Landmark,
    title: "Sarana Ibadah",
    desc: "Tempat ibadah untuk mendukung pembinaan karakter dan akhlak siswa.",
    image: "",
  },
  {
    icon: Trophy,
    title: "Sarana Olahraga",
    desc: "Lapangan dan fasilitas olahraga untuk kegiatan jasmani dan ekstrakurikuler.",
    image: "",
  },
];

const AUTOPLAY_MS = 4500;

export default function Fasilitas() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const total = fasilitas.length;

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const el = track?.children[index] as HTMLElement | undefined;
    if (!track || !el) return;
    track.scrollTo({ left: el.offsetLeft, behavior: "smooth" });
  }, []);

  const next = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    scrollToIndex(atEnd ? 0 : Math.min(active + 1, total - 1));
  }, [active, scrollToIndex, total]);

  const prev = useCallback(() => {
    scrollToIndex(active === 0 ? total - 1 : active - 1);
  }, [active, scrollToIndex, total]);

  // Sinkronkan indikator dengan posisi scroll (swipe / drag / tombol)
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (atEnd) {
      setActive(total - 1);
      return;
    }
    let nearest = 0;
    let min = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const d = Math.abs((child as HTMLElement).offsetLeft - track.scrollLeft);
      if (d < min) {
        min = d;
        nearest = i;
      }
    });
    setActive(nearest);
  }, [total]);

  // Hormati preferensi "reduce motion"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Autoplay (berhenti saat di-hover / dijeda / reduce motion)
  useEffect(() => {
    if (!playing || hovered || reducedMotion) return;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [playing, hovered, reducedMotion, active, next]);

  const autoplayOn = playing && !hovered && !reducedMotion;

  return (
    <section
      id="fasilitas"
      className="relative scroll-mt-16 overflow-hidden bg-emerald-50/60 py-20 lg:py-28 dark:bg-emerald-950/10"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700">
              Fasilitas Sekolah
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Lingkungan Belajar yang{" "}
              <span className="text-emerald-600">Mendukung</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sarana dan prasarana yang kami siapkan agar setiap siswa dapat
              belajar, berpraktik, dan berkembang dengan optimal.
            </p>
          </div>

          {/* Kontrol */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Jeda otomatis geser" : "Putar otomatis geser"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label="Fasilitas sebelumnya"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Fasilitas berikutnya"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="mt-12"
          role="region"
          aria-roledescription="carousel"
          aria-label="Fasilitas sekolah"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            tabIndex={0}
            className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {fasilitas.map((f, i) => {
              const isActive = i === active;
              return (
                <article
                  key={f.title}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} dari ${total}`}
                  className={`group w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-500 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] dark:bg-card ${
                    isActive
                      ? "border-emerald-300 shadow-xl shadow-emerald-100"
                      : "border-emerald-100 opacity-90"
                  } hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-100`}
                >
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-200 via-emerald-300 to-green-400">
                    {f.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={f.image}
                        alt={f.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <f.icon className="absolute -bottom-6 -right-6 h-44 w-44 text-white/30 transition duration-500 group-hover:rotate-6 group-hover:scale-110" />
                    )}

                    <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md">
                      <f.icon className="h-6 w-6" />
                    </div>

                    <span className="absolute bottom-4 left-4 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Indikator */}
          <div className="mt-2 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Pilih slide">
              {fasilitas.map((f, i) => (
                <button
                  key={f.title}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Ke ${f.title}`}
                  onClick={() => scrollToIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    i === active
                      ? "w-8 bg-emerald-500"
                      : "w-2.5 bg-emerald-200 hover:bg-emerald-300"
                  }`}
                />
              ))}
            </div>

            {/* Progress autoplay */}
            <div className="h-1 w-40 overflow-hidden rounded-full bg-emerald-100">
              <div
                key={`${active}-${autoplayOn}`}
                className="h-full rounded-full bg-emerald-500"
                style={
                  autoplayOn
                    ? { animation: `fasilitas-progress ${AUTOPLAY_MS}ms linear forwards` }
                    : { width: "0%" }
                }
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fasilitas-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}