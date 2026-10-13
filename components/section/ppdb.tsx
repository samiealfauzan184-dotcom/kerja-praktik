import {
  ArrowRight,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Monitor,
  Sprout,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Ubah data di bawah ini sesuai informasi resmi sekolah
const TAHUN_AJARAN = "2027/2028";

const jalur = [
  {
    icon: FileText,
    title: "Pendaftaran Online",
    date: "[isi tanggal]",
    desc: "Isi formulir dan unggah berkas persyaratan melalui website resmi.",
  },
  {
    icon: ClipboardCheck,
    title: "Verifikasi Berkas",
    date: "[isi tanggal]",
    desc: "Panitia memeriksa kelengkapan dan keabsahan dokumen pendaftar.",
  },
  {
    icon: Trophy,
    title: "Seleksi",
    date: "[isi tanggal]",
    desc: "Seleksi sesuai jalur yang dipilih dan jurusan tujuan.",
  },
  {
    icon: CalendarCheck,
    title: "Pengumuman & Daftar Ulang",
    date: "[isi tanggal]",
    desc: "Cek hasil seleksi, lalu lakukan daftar ulang bagi peserta yang diterima.",
  },
];

const persyaratan = [
  "Lulusan SMP/MTs atau sederajat",
  "Fotokopi ijazah / surat keterangan lulus",
  "Fotokopi kartu keluarga dan akta kelahiran",
  "Pas foto terbaru",
  "Sehat jasmani dan rohani",
];

const jurusan = [
  {
    icon: Sprout,
    kode: "APHP",
    nama: "Agribisnis Pengolahan Hasil Pertanian",
    desc: "Belajar mengolah hasil pertanian menjadi produk bernilai jual.",
  },
  {
    icon: Monitor,
    kode: "TKJ",
    nama: "Teknik Komputer dan Jaringan",
    desc: "Belajar merakit komputer, mengelola jaringan, dan teknologi server.",
  },
];

export default function Ppdb() {
  return (
    <section
      id="ppdb"
      className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-white via-emerald-50/60 to-white py-20 lg:py-28 dark:from-background dark:via-emerald-950/20 dark:to-background"
    >
      {/* dekorasi latar */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-lime-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            <GraduationCap className="h-4 w-4" />
            PPDB {TAHUN_AJARAN}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Penerimaan Peserta Didik Baru
          </h2>
          <p className="mt-4 text-muted-foreground">
            Bergabunglah bersama SMKN Pertanian 1 Sukaraja dan siapkan masa
            depanmu di bidang pertanian dan teknologi.
          </p>
        </div>

        {/* Jurusan */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {jurusan.map((j) => (
            <div
              key={j.kode}
              className="group flex gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-100 dark:bg-card"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white transition group-hover:rotate-6">
                <j.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-emerald-600">
                  {j.kode}
                </p>
                <h3 className="font-semibold leading-snug">{j.nama}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{j.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Alur + persyaratan */}
        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h3 className="mb-6 text-xl font-semibold">Alur Pendaftaran</h3>
            <ol className="relative space-y-6 border-l-2 border-dashed border-emerald-200 pl-8">
              {jalur.map((step, i) => (
                <li key={step.title} className="relative">
                  <span className="absolute -left-[3.2rem] flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white ring-4 ring-white dark:ring-background">
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold">{step.title}</h4>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {step.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-xl shadow-emerald-200 sm:p-8">
              <h3 className="text-xl font-semibold">Persyaratan Umum</h3>
              <ul className="mt-5 space-y-3">
                {persyaratan.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-xs">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className="mt-8 w-full gap-2 bg-white text-emerald-700 hover:bg-emerald-50"
              >
                <a href="#">
                  Daftar Sekarang <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <p className="mt-3 text-center text-xs text-white/80">
                Ganti tautan tombol dengan alamat pendaftaran resmi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}