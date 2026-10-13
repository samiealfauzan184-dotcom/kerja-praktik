"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Tilted Grid Hero (versi bisa digeser) ───────────────────────
 * Barisan kartu melengkung seperti dinding silinder: tengah menghadap
 * lurus, ujung-ujungnya melengkung ke arah penonton lalu memudar.
 *
 * Perbedaan dari versi asli: gerak tidak lagi memakai CSS keyframes,
 * tetapi digerakkan oleh JS (requestAnimationFrame) supaya kartu bisa:
 *   - digeser dengan drag mouse / swipe jari (ada inersia),
 *   - digeser dengan tombol panah di layar dan tombol ← → keyboard,
 *   - berjalan otomatis, dan berhenti sementara saat kursor di atasnya.
 * ─────────────────────────────────────────────────────────────── */

const SLICES = 16;
const CAMERA = 1.6;
const MAX_WIDTH = 55;

function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number,
) {
  const h = Math.min(
    (tile / 100) * height,
    ((MAX_WIDTH / 100) * width) / aspect,
  );
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0))
    return { columns: 2, sweep: 0, unit: 0, limit: 0, perPx: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
    // derajat busur per piksel layar (di tengah, skala 1:1)
    perPx: +deg(1 / radius).toFixed(6),
  };
}

export type TiltedGridImage = {
  src: string;
  alt?: string;
};

export type TiltedGridHeroProps = {
  images: TiltedGridImage[];
  /** Detik untuk maju satu kartu (jalan otomatis). @default 4 */
  speed?: number;
  /** Tinggi kartu, persen dari tinggi hero. @default 26 */
  tileHeight?: number;
  /** Lebar kartu dibagi tinggi. @default 16 / 9 */
  aspectRatio?: number;
  /** Jarak antar kartu, persen dari tinggi kartu. @default 6 */
  gap?: number;
  /** Posisi vertikal baris kartu, persen dari tinggi hero. @default 56 */
  axis?: number;
  /** Seberapa melengkung ujung baris (derajat, 5–85). @default 80 */
  curve?: number;
  /** Lebar pudar di tiap ujung, persen dari lebar hero. @default 12 */
  fade?: number;
  /** Jalan otomatis. @default true */
  autoplay?: boolean;
  /** Tampilkan tombol panah kiri/kanan. @default false */
  arrows?: boolean;
  /** Label aksesibilitas untuk carousel. */
  label?: string;
  children?: React.ReactNode;
  className?: string;
};

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  autoplay = true,
  arrows = false,
  label = "Galeri kartu",
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & TiltedGridHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const tilesRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const lapsRef = React.useRef<number[]>([]);
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  // Status gerak disimpan di ref supaya tidak memicu render ulang tiap frame
  const motion = React.useRef({
    pos: 0, // posisi sepanjang loop (derajat)
    vel: 0, // kecepatan (derajat/detik)
    dragging: false,
    hover: false,
    lastX: 0,
    lastT: 0,
    dragVel: 0,
    step: 0, // jarak antar kartu (derajat)
    perPx: 0,
  });

  const [layout, setLayout] = React.useState<ReturnType<typeof measure> | null>(
    null,
  );
  const [laps, setLaps] = React.useState<number[]>([]);
  const [grabbing, setGrabbing] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) =>
        prev?.columns === next.columns &&
        prev.sweep === next.sweep &&
        prev.unit === next.unit
          ? prev
          : next,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  React.useEffect(() => {
    for (const { src } of images) new Image().src = src;
  }, [images]);

  const { columns, sweep, unit, limit, perPx } =
    layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);

  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(
      MAX_WIDTH / aspectRatio
    ).toFixed(4)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  const turn = React.useCallback(
    (deg: number) =>
      `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`,
    [radius],
  );

  // Mesin gerak: menaruh tiap kartu di busur sesuai posisi `pos`
  React.useEffect(() => {
    if (!layout || !(layout.sweep > 0)) return;
    const m = motion.current;
    const loop = layout.sweep * 2;
    const spacing = loop / layout.columns;
    m.step = spacing;
    m.perPx = layout.perPx;
    const v0 = speed > 0 ? spacing / speed : 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    lapsRef.current = [];
    let raf = 0;
    let prev = 0;

    const apply = () => {
      const next = lapsRef.current.slice();
      let changed = false;
      for (let t = 0; t < layout.columns; t++) {
        const el = tilesRef.current[t];
        if (!el) continue;
        const p = t * spacing + m.pos;
        const lap = Math.floor(p / loop);
        const ang = p - lap * loop - layout.sweep;
        el.style.transform = turn(ang);
        el.style.visibility = Math.abs(ang) > layout.limit ? "hidden" : "visible";
        if (next[t] !== lap) {
          next[t] = lap;
          changed = true;
        }
      }
      if (changed) {
        lapsRef.current = next;
        setLaps(next);
      }
    };

    const tick = (now: number) => {
      const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0;
      prev = now;
      if (!m.dragging) {
        const target = autoplay && !reduce && !m.hover ? v0 : 0;
        m.vel += (target - m.vel) * (1 - Math.exp(-dt * 2.5));
        m.pos += m.vel * dt;
      }
      apply();
      raf = requestAnimationFrame(tick);
    };

    apply();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [layout, speed, autoplay, turn]);

  const nudge = React.useCallback((dir: 1 | -1) => {
    const m = motion.current;
    m.vel += dir * m.step * 2.5;
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a,button,input,textarea,select"))
      return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const m = motion.current;
    m.dragging = true;
    m.lastX = e.clientX;
    m.lastT = e.timeStamp;
    m.dragVel = 0;
    m.vel = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrabbing(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    const dx = e.clientX - m.lastX;
    const dt = Math.max(e.timeStamp - m.lastT, 1) / 1000;
    const dDeg = -dx * m.perPx; // geser ke kiri = maju
    m.pos += dDeg;
    m.dragVel = m.dragVel * 0.6 + (dDeg / dt) * 0.4;
    m.lastX = e.clientX;
    m.lastT = e.timeStamp;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    m.dragging = false;
    const idleMs = e.timeStamp - m.lastT;
    const max = m.step * 8;
    m.vel =
      idleMs > 80 ? 0 : Math.max(-max, Math.min(max, m.dragVel));
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setGrabbing(false);
  };

  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${
    100 - fade
  }%,transparent)`;
  const share = aspectRatio / SLICES;
  const total = Math.max(images.length, 1);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      {...props}
      ref={ref}
      className={cn(
        "relative select-none overflow-hidden outline-none",
        grabbing ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{ containerType: "size", touchAction: "pan-y", ...props.style }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => {
        motion.current.hover = true;
      }}
      onPointerLeave={() => {
        motion.current.hover = false;
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") nudge(1);
        if (e.key === "ArrowLeft") nudge(-1);
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const n = (laps[t] ?? 0) * columns + first;
          const img = images[((n % total) + total) % total];
          return (
            <div
              key={t}
              ref={(el) => {
                tilesRef.current[t] = el;
              }}
              className="absolute"
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  className={cn(
                    "absolute top-0 overflow-hidden bg-muted",
                    k === 0 && "rounded-l-lg",
                    k === SLICES - 1 && "rounded-r-lg",
                  )}
                  style={{
                    left: u((aspectRatio - share) / 2),
                    width:
                      k === SLICES - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                    height: u(1),
                    transform: turn(
                      (aspectRatio / 2 - (k + 0.5) * share) * unit,
                    ),
                  }}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.src}
                      alt=""
                      draggable={false}
                      className="absolute top-0 max-w-none object-cover"
                      style={{
                        left: u(-k * share),
                        width: u(aspectRatio),
                        height: u(1),
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {arrows && (
        <>
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Geser ke kiri"
            className="absolute left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white/90 text-emerald-700 shadow-md backdrop-blur transition hover:scale-110 hover:bg-emerald-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:left-6"
            style={{ top: `${axis}%` }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Geser ke kanan"
            className="absolute right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-200 bg-white/90 text-emerald-700 shadow-md backdrop-blur transition hover:scale-110 hover:bg-emerald-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:right-6"
            style={{ top: `${axis}%` }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {children}
    </div>
  );
}

export default TiltedGridHero;