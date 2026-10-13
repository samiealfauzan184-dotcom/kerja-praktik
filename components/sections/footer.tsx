import {
  ArrowUp,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

// Ubah data di bawah ini sesuai informasi resmi sekolah
const NAMA_SEKOLAH = "SMKN Pertanian 1 Sukaraja";
const TAHUN = 2026; // ubah manual setiap pergantian tahun
const ALAMAT = "[isi alamat lengkap sekolah]";
const TELEPON = "[isi nomor telepon]";
const EMAIL = "[isi email sekolah]";
const JAM_LAYANAN = "Senin – Jumat, 07.00 – 15.00 WIB";

const menu = [
  { title: "Beranda", href: "#" },
  { title: "Sambutan", href: "#sambutan" },
  { title: "Fasilitas", href: "#fasilitas" },
  { title: "PPDB", href: "#ppdb" },
];

const jurusan = [
  "Agribisnis Pengolahan Hasil Pertanian (APHP)",
  "Teknik Komputer dan Jaringan (TKJ)",
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-emerald-950 text-emerald-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Identitas */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span className="text-lg font-bold leading-tight">
                {NAMA_SEKOLAH}
              </span>
            </div>
            <p className="mt-4 text-sm text-emerald-100/70">
              Mencetak lulusan yang cageur, bageur, bener, pinter, dan singer,
              siap bekerja, berwirausaha, dan melanjutkan pendidikan.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Menu
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {menu.map((m) => (
                <li key={m.title}>
                  <a
                    href={m.href}
                    className="text-emerald-100/80 transition hover:translate-x-1 hover:text-white inline-block"
                  >
                    {m.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Jurusan */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Jurusan
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-emerald-100/80">
              {jurusan.map((j) => (
                <li key={j}>{j}</li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-emerald-100/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {ALAMAT}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {TELEPON}
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {EMAIL}
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {JAM_LAYANAN}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-emerald-800 pt-6 text-sm text-emerald-100/60 sm:flex-row">
          <p>
            &copy; {TAHUN} {NAMA_SEKOLAH}. Hak cipta
            dilindungi.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-700 px-4 py-2 text-emerald-100 transition hover:bg-emerald-500 hover:text-white"
          >
            Kembali ke atas <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}