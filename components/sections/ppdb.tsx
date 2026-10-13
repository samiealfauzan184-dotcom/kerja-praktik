import { ArrowRight, GraduationCap } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

// Ubah data di bawah ini sesuai informasi resmi sekolah
const TAHUN_AJARAN = "2027/2028";
const LINK_DAFTAR = "https://youtube.com"; // ganti dengan alamat pendaftaran resmi

const jurusan = [
  {
    kode: "APHP",
    nama: "Agribisnis Pengolahan Hasil Pertanian",
    warna: ["#10b981", "#047857"],
  },
  {
    kode: "TKJ",
    nama: "Teknik Komputer dan Jaringan",
    warna: ["#14b8a6", "#0f766e"],
  },
  {
    kode: "TITL",
    nama: "Teknik Instalasi Tenaga Listrik",
    warna: ["#f59e0b", "#b45309"],
  },
  {
    kode: "APAT",
    nama: "Agribisnis Perikanan Air Tawar",
    warna: ["#0ea5e9", "#1d4ed8"],
  },
];

// Membuat gambar kartu (SVG) untuk carousel. Untuk memakai foto asli,
// ganti `src` di `kartuJurusan` dengan path foto, misalnya "/jurusan/tkj.jpg".
function buatKartu(kode: string, nama: string, dari: string, ke: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${dari}"/><stop offset="1" stop-color="${ke}"/>` +
    `</linearGradient></defs>` +
    `<rect width="1280" height="720" fill="url(#g)"/>` +
    `<circle cx="1110" cy="110" r="270" fill="#fff" fill-opacity=".10"/>` +
    `<circle cx="170" cy="680" r="230" fill="#fff" fill-opacity=".08"/>` +
    `<text x="80" y="340" font-family="Arial, Helvetica, sans-serif" font-size="240" font-weight="800" fill="#fff">${kode}</text>` +
    `<text x="86" y="440" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="600" fill="#fff" fill-opacity=".95">${nama}</text>` +
    `<text x="86" y="640" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="6" fill="#fff" fill-opacity=".8">SMKN PERTANIAN 1 SUKARAJA</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const kartuJurusan = jurusan.map((j) => ({
  src: buatKartu(j.kode, j.nama, j.warna[0], j.warna[1]),
  alt: j.nama,
}));

export default function Ppdb() {
  return (
    <section
      id="ppdb"
      className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-white via-emerald-50/60 to-white pb-10 lg:pb-16 dark:from-background dark:via-emerald-950/20 dark:to-background"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />

      {/* Kartu jurusan melengkung yang bisa digeser */}
      <TiltedGridHero
        images={kartuJurusan}
        arrows
        label="Daftar jurusan"
        speed={5}
        tileHeight={28}
        axis={55}
        curve={75}
        className="h-[620px] w-full sm:h-[680px]"
      >
        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between py-10 text-center">
          <div className="px-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
              <GraduationCap className="h-4 w-4" />
              PPDB {TAHUN_AJARAN}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Penerimaan Peserta Didik Baru
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Bergabunglah bersama SMKN Pertanian 1 Sukaraja dan siapkan masa
              depanmu di bidang pertanian dan teknologi.
            </p>
          </div>

          {/* Ajakan daftar di bawah kartu */}
          <div className="flex flex-col items-center gap-4 px-6">
            <p className="text-xs text-muted-foreground">
              Geser kartu atau gunakan tombol panah untuk melihat jurusan
            </p>

            <div className="pointer-events-auto relative inline-flex">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-emerald-400/40 motion-safe:animate-ping [animation-duration:2.6s]"
              />
              <a
                href={LINK_DAFTAR}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-emerald-500 to-lime-500 py-3.5 pl-8 pr-4 text-base font-bold text-white shadow-xl shadow-emerald-300/60 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 active:scale-95"
              >
                <span
                  aria-hidden
                  className="ppdb-shine pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-white/40"
                />
                <span className="relative">Daftar Sekarang</span>
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/25 transition duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-emerald-600">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </TiltedGridHero>

      <style>{`
        @keyframes ppdb-shine {
          0% { left: -30%; }
          55%, 100% { left: 130%; }
        }
        .ppdb-shine { animation: ppdb-shine 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ppdb-shine { animation: none; display: none; }
        }
      `}</style>
    </section>
  );
}