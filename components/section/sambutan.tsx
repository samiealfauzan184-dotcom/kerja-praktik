import { Quote } from "lucide-react";

const NAMA_KEPSEK = "[Nama Kepala Sekolah]";

export default function Sambutan() {
  return (
    <section id="sambutan" className="scroll-mt-16 bg-white py-20 lg:py-28 dark:bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-5">
        {/* Foto */}
        <div className="relative mx-auto w-full max-w-sm lg:col-span-2">
          <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[2.5rem] bg-emerald-200/70" />
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-lime-200" />

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white bg-gradient-to-br from-emerald-100 to-emerald-300 shadow-xl">
            {/* Ganti dengan foto kepala sekolah:
                <img src="/kepsek.jpg" alt={NAMA_KEPSEK} className="h-full w-full object-cover" /> */}
            <div className="flex h-full items-center justify-center text-sm font-medium text-emerald-700/70">
              Foto Kepala Sekolah
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border border-emerald-100 bg-white px-5 py-3 text-center shadow-lg dark:bg-card">
            <p className="font-semibold">{NAMA_KEPSEK}</p>
            <p className="text-xs text-emerald-600">
              Kepala SMKN Pertanian 1 Sukaraja
            </p>
          </div>
        </div>

        {/* Teks sambutan */}
        <div className="lg:col-span-3">
          <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
            Sambutan Kepala Sekolah
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Tumbuh Bersama, <span className="text-emerald-600">Berkarya untuk Negeri</span>
          </h2>

          <div className="relative mt-8 rounded-3xl bg-emerald-50/70 p-6 sm:p-8">
            <Quote className="absolute -top-4 left-6 h-9 w-9 rounded-full bg-emerald-500 p-2 text-white" />
            <div className="space-y-4 text-muted-foreground">
              <p>
                Assalamu&apos;alaikum warahmatullahi wabarakatuh. Selamat datang
                di website resmi SMKN Pertanian 1 Sukaraja. Kami bersyukur dapat
                menyapa Anda melalui laman ini sebagai wadah informasi dan
                perkenalan sekolah kami.
              </p>
              <p>
                Melalui Kurikulum Merdeka, kami membekali peserta didik dengan
                keterampilan di bidang pertanian dan teknologi, serta karakter
                yang kuat melalui nilai-nilai Pancawaluya. Kami ingin lulusan
                yang cageur, bageur, bener, pinter, dan singer: siap bekerja,
                berwirausaha, maupun melanjutkan pendidikan.
              </p>
              <p>
                Terima kasih kepada seluruh guru, tenaga kependidikan, orang
                tua, dan mitra yang terus mendukung kemajuan sekolah. Mari kita
                tumbuh bersama untuk mencetak generasi yang unggul dan
                berakhlak.
              </p>
              <p className="font-medium text-foreground">
                Wassalamu&apos;alaikum warahmatullahi wabarakatuh.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px w-12 bg-emerald-400" />
            <div>
              <p className="font-semibold">{NAMA_KEPSEK}</p>
              <p className="text-sm text-muted-foreground">Kepala Sekolah</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}