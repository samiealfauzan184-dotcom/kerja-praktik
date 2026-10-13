"use client";

import { useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Leaf,
  RotateCcw,
  Sparkles,
  Terminal,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Soal contoh untuk kartu kuis di hero. Ubah sesuai kebutuhan.
const soal = [
  {
    jurusan: "APHP",
    q: "Unsur hara makro yang paling dibutuhkan tanaman untuk pertumbuhan daun adalah...",
    options: ["Nitrogen (N)", "Besi (Fe)", "Seng (Zn)", "Tembaga (Cu)"],
    answer: 0,
  },
  {
    jurusan: "TKJ",
    q: "Perangkat yang menghubungkan beberapa komputer dalam satu jaringan lokal adalah...",
    options: ["Printer", "Switch", "Monitor", "Speaker"],
    answer: 1,
  },
  {
    jurusan: "TKJ",
    q: "Alamat IP versi 4 (IPv4) terdiri dari berapa bit?",
    options: ["8 bit", "16 bit", "32 bit", "64 bit"],
    answer: 2,
  },
  {
    jurusan: "APHP",
    q: "Pengawetan makanan dengan cara mengurangi kadar air disebut...",
    options: ["Perendaman", "Pembekuan", "Pencucian", "Pengeringan"],
    answer: 3,
  },
];

const huruf = ["A", "B", "C", "D"];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = soal[index];
  const answered = selected !== null;
  const progress = ((index + (answered ? 1 : 0)) / soal.length) * 100;

  const pilih = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === current.answer) setScore((s) => s + 1);
  };

  const lanjut = () => {
    if (index === soal.length - 1) {
      setFinished(true);
    } else {
      setIndex((n) => n + 1);
      setSelected(null);
    }
  };

  const ulang = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/30 dark:via-background dark:to-background">
      {/* Dekorasi latar */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(16 185 129 / 0.25) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="hero-blob pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />
      <div className="hero-blob-slow pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-lime-300/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-28">
        {/* Teks */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Platform Kuis SMKN Pertanian 1 Sukaraja
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Uji Pengetahuanmu,{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
              Tumbuh Lebih Pintar
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
            Kerjakan kuis interaktif seputar pertanian dan teknologi komputer.
            Dapatkan skor langsung, pelajari pembahasannya, dan siapkan dirimu
            untuk ujian.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center">
            <Button
              asChild
              size="lg"
              className="group h-12 gap-2 rounded-full bg-emerald-500 px-8 text-base text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600"
            >
              <a href="#kuis">
                Mulai Kuis
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-emerald-200 bg-white px-8 text-base text-emerald-700 hover:bg-emerald-50"
            >
              <a href="#fasilitas">Lihat Fasilitas</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {[
              { icon: Zap, text: "Skor langsung" },
              { icon: Leaf, text: "Jurusan APHP" },
              { icon: Terminal, text: "Jurusan TKJ" },
            ].map((c) => (
              <span
                key={c.text}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-2 text-sm font-medium text-emerald-800"
              >
                <c.icon className="h-4 w-4" />
                {c.text}
              </span>
            ))}
          </div>
        </div>

        {/* Kartu kuis interaktif */}
        <div id="kuis" className="relative mx-auto w-full max-w-lg scroll-mt-24">
          {/* Chip melayang */}
          <div className="hero-float absolute -left-4 -top-5 z-10 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold shadow-lg sm:-left-8">
            <Award className="h-5 w-5 text-amber-500" />
            Skor: {score}/{soal.length}
          </div>
          <div className="hero-float-delay absolute -bottom-5 -right-3 z-10 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold shadow-lg sm:-right-6">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Coba jawab!
          </div>

          <div className="relative rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-2xl shadow-emerald-200/60 backdrop-blur sm:p-8 dark:bg-card">
            {!finished ? (
              <>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-white">
                    {current.jurusan}
                  </span>
                  <span className="text-muted-foreground">
                    Soal {index + 1} dari {soal.length}
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <h2
                  key={index}
                  className="hero-pop mt-6 text-lg font-semibold leading-snug"
                >
                  {current.q}
                </h2>

                <div className="mt-5 space-y-3">
                  {current.options.map((opt, i) => {
                    const isCorrect = i === current.answer;
                    const isSelected = i === selected;
                    let style =
                      "border-emerald-100 bg-white hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md dark:bg-background";
                    if (answered && isCorrect)
                      style = "border-emerald-500 bg-emerald-50 text-emerald-800";
                    else if (answered && isSelected)
                      style = "hero-shake border-red-400 bg-red-50 text-red-700";
                    else if (answered) style = "border-emerald-100 opacity-50";

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={answered}
                        onClick={() => pilih(i)}
                        className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${style}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-700">
                          {huruf[i]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {answered && isCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        )}
                        {answered && isSelected && !isCorrect && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex min-h-11 items-center justify-between gap-3">
                  <p
                    aria-live="polite"
                    className={`text-sm font-medium ${
                      !answered
                        ? "text-muted-foreground"
                        : selected === current.answer
                          ? "text-emerald-600"
                          : "text-red-600"
                    }`}
                  >
                    {!answered
                      ? "Pilih satu jawaban."
                      : selected === current.answer
                        ? "Benar! Kerja bagus."
                        : `Kurang tepat. Jawaban: ${current.options[current.answer]}`}
                  </p>
                  {answered && (
                    <Button
                      onClick={lanjut}
                      className="hero-pop shrink-0 gap-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      {index === soal.length - 1 ? "Lihat Hasil" : "Lanjut"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="hero-pop flex flex-col items-center py-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 text-white shadow-lg">
                  <Award className="h-10 w-10" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">
                  Skor kamu {score}/{soal.length}
                </h2>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  {score === soal.length
                    ? "Sempurna! Pengetahuanmu sudah siap untuk tantangan berikutnya."
                    : score >= soal.length / 2
                      ? "Bagus! Sedikit latihan lagi untuk hasil yang lebih maksimal."
                      : "Jangan menyerah, ulangi kuisnya dan coba lagi."}
                </p>
                <Button
                  onClick={ulang}
                  className="mt-6 gap-2 rounded-full bg-emerald-500 px-6 text-white hover:bg-emerald-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Main Lagi
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes hero-blob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,20px) scale(1.1); } }
        @keyframes hero-pop { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes hero-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .hero-float { animation: hero-float 4s ease-in-out infinite; }
        .hero-float-delay { animation: hero-float 4s ease-in-out 1.2s infinite; }
        .hero-blob { animation: hero-blob 10s ease-in-out infinite; }
        .hero-blob-slow { animation: hero-blob 14s ease-in-out infinite reverse; }
        .hero-pop { animation: hero-pop .35s ease-out both; }
        .hero-shake { animation: hero-shake .35s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .hero-float, .hero-float-delay, .hero-blob, .hero-blob-slow, .hero-pop, .hero-shake { animation: none; }
        }
      `}</style>
    </section>
  );
}