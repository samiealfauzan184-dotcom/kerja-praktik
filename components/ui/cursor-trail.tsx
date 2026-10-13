"use client";

import { useEffect, useRef } from "react";

type Leaf = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  phase: number;
  life: number;
  decay: number;
  hue: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  life: number;
  decay: number;
  hue: number;
};

type Burst = { x: number; y: number; life: number; rot: number };

const TAIL = 28; // jumlah titik pita ekor
const INTERACTIVE = "a, button, [role='tab'], summary, label, select";
const IDLE_AFTER_MS = 140;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Nonaktif di layar sentuh dan jika pengguna memilih "reduce motion"
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const leaves: Leaf[] = [];
    const sparks: Spark[] = [];
    const bursts: Burst[] = [];
    const tail = Array.from({ length: TAIL }, () => ({ x: 0, y: 0 }));

    let raf = 0;
    let prevT = 0;
    let visible = false;
    let mx = 0;
    let my = 0;
    let lastMoveAt = 0;
    let idle = 0;
    let frame = 0;
    let hoverEl: Element | null = null;
    let lastX = 0;
    let lastY = 0;
    let hasLast = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Warna: emerald, lime, dan sedikit emas
    const pickHue = () => {
      const r = Math.random();
      if (r < 0.15) return 40 + Math.random() * 15; // emas
      if (r < 0.5) return 75 + Math.random() * 30; // lime
      return 140 + Math.random() * 30; // emerald
    };

    const spawnLeaf = (x: number, y: number, o: Partial<Leaf> = {}) => {
      if (leaves.length > 70) leaves.shift();
      leaves.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -0.2 - Math.random() * 0.7,
        size: 5 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        life: 1,
        decay: 0.006 + Math.random() * 0.006,
        hue: 110 + Math.random() * 50,
        ...o,
      });
    };

    const spawnSpark = (x: number, y: number, o: Partial<Spark> = {}) => {
      if (sparks.length > 110) sparks.shift();
      sparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 2 + Math.random() * 3.5,
        rot: Math.random() * Math.PI,
        life: 1,
        decay: 0.018 + Math.random() * 0.02,
        hue: pickHue(),
        ...o,
      });
    };

    // Bintang empat sudut
    const drawStar = (
      x: number,
      y: number,
      r: number,
      rot: number,
      hue: number,
      alpha: number
    ) => {
      const k = r * 0.18;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = `hsl(${hue}, 90%, 55%)`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsl(${hue}, 95%, 55%)`;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(k, -k, r, 0);
      ctx.quadraticCurveTo(k, k, 0, r);
      ctx.quadraticCurveTo(-k, k, -r, 0);
      ctx.quadraticCurveTo(-k, -k, 0, -r);
      ctx.fill();
      ctx.restore();
    };

    const drawLeaf = (l: Leaf) => {
      const s = l.size;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.globalAlpha = Math.min(1, l.life * 1.4);
      ctx.fillStyle = `hsl(${l.hue}, 65%, 42%)`;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.4, s * 0.9, s * 0.5, 0, s);
      ctx.bezierCurveTo(-s * 0.9, s * 0.5, -s * 0.9, -s * 0.4, 0, -s);
      ctx.fill();
      ctx.strokeStyle = `hsla(${l.hue}, 70%, 78%, 0.85)`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.8);
      ctx.lineTo(0, s * 0.8);
      ctx.stroke();
      ctx.restore();
    };

    const draw = (t: number) => {
      const f = Math.min((t - (prevT || t)) / 16.667, 3);
      prevT = t;
      const ease = (k: number) => 1 - Math.pow(1 - k, f);
      frame++;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const isIdle = visible && t - lastMoveAt > IDLE_AFTER_MS;
      idle += ((isIdle ? 1 : 0) - idle) * ease(0.05);

      // Pita ekor: kepala mengikuti ujung kursor, sisanya mengejar titik di depannya
      tail[0].x = mx;
      tail[0].y = my;
      for (let i = 1; i < TAIL; i++) {
        tail[i].x += (tail[i - 1].x - tail[i].x) * ease(0.36);
        tail[i].y += (tail[i - 1].y - tail[i].y) * ease(0.36);
      }

      if (visible) {
        // Efek saat kursor diam: daun gugur dan bintang berkelip di sekitarnya
        if (idle > 0.6) {
          if (frame % 24 === 0) {
            const a = Math.random() * Math.PI * 2;
            spawnLeaf(mx + Math.cos(a) * 16, my + Math.sin(a) * 16, {
              vx: Math.cos(a) * 0.6,
              vy: Math.sin(a) * 0.5 - 0.3,
            });
          }
          if (frame % 10 === 0) {
            const a = Math.random() * Math.PI * 2;
            const d = 14 + Math.random() * 26;
            spawnSpark(mx + Math.cos(a) * d, my + Math.sin(a) * d, {
              vx: Math.cos(a) * 0.25,
              vy: Math.sin(a) * 0.25 - 0.2,
              decay: 0.014,
            });
          }
        }

        // Efek hover: percikan keluar dari tepi tombol / tautan
        if (hoverEl && hoverEl.isConnected && frame % 3 === 0) {
          const b = hoverEl.getBoundingClientRect();
          if (b.width > 0 && b.width <= 520 && b.height <= 160) {
            const side = Math.floor(Math.random() * 4);
            let px = b.left + Math.random() * b.width;
            let py = b.top;
            let vx = 0;
            let vy = -0.6;
            if (side === 1) {
              py = b.bottom;
              vy = 0.6;
            } else if (side === 2) {
              px = b.left;
              py = b.top + Math.random() * b.height;
              vx = -0.6;
              vy = 0;
            } else if (side === 3) {
              px = b.right;
              py = b.top + Math.random() * b.height;
              vx = 0.6;
              vy = 0;
            }
            spawnSpark(px, py, { vx, vy, size: 2.5 + Math.random() * 2.5, decay: 0.03 });
          }
        }

        // Pita bergradien dari emerald ke lime lalu emas di ujung
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 8;
        for (let i = 0; i < TAIL - 1; i++) {
          const p = 1 - i / (TAIL - 1);
          const hue = 150 - (1 - p) * 105; // 150 (emerald) → 45 (emas)
          ctx.strokeStyle = `hsla(${hue}, 85%, 50%, ${p * 0.7})`;
          ctx.shadowColor = `hsla(${hue}, 90%, 55%, ${p * 0.6})`;
          ctx.lineWidth = 1 + p * 7;
          ctx.beginPath();
          ctx.moveTo(tail[i].x, tail[i].y);
          ctx.lineTo(tail[i + 1].x, tail[i + 1].y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Tiga bintang mengorbit saat kursor diam
        if (idle > 0.03) {
          for (let k = 0; k < 3; k++) {
            const ang = t * 0.0028 + (k * Math.PI * 2) / 3;
            const rad = 24 + Math.sin(t * 0.004 + k) * 3;
            drawStar(
              mx + Math.cos(ang) * rad,
              my + Math.sin(ang) * rad,
              4.5 + Math.sin(t * 0.008 + k * 2) * 1.5,
              ang * 2,
              k === 0 ? 150 : k === 1 ? 90 : 48,
              idle * 0.95
            );
          }
        }
      }

      // Daun
      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.phase += 0.05 * f;
        l.x += (l.vx + Math.sin(l.phase) * 0.5) * f;
        l.y += l.vy * f;
        l.vy += 0.012 * f;
        l.vx *= 0.99;
        l.rot += l.vr * f;
        l.life -= l.decay * f;
        if (l.life <= 0) {
          leaves.splice(i, 1);
          continue;
        }
        drawLeaf(l);
      }

      // Percikan bintang
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.rot += 0.05 * f;
        p.life -= p.decay * f;
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        drawStar(p.x, p.y, p.size * (0.6 + p.life * 0.9) * 1.6, p.rot, p.hue, p.life);
      }
      ctx.shadowBlur = 0;

      // Sinar menyebar saat klik
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.life -= 0.045 * f;
        if (b.life <= 0) {
          bursts.splice(i, 1);
          continue;
        }
        const grow = 1 - b.life;
        const r0 = 8 + grow * 18;
        const r1 = r0 + 10 + b.life * 16;
        ctx.lineCap = "round";
        for (let k = 0; k < 12; k++) {
          const a = b.rot + (k / 12) * Math.PI * 2;
          ctx.strokeStyle = `hsla(${k % 2 ? 145 : 70}, 85%, 50%, ${b.life})`;
          ctx.lineWidth = 2.2 * b.life + 0.4;
          ctx.beginPath();
          ctx.moveTo(b.x + Math.cos(a) * r0, b.y + Math.sin(a) * r0);
          ctx.lineTo(b.x + Math.cos(a) * r1, b.y + Math.sin(a) * r1);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        for (const p of tail) {
          p.x = e.clientX;
          p.y = e.clientY;
        }
      }
      visible = true;
      lastMoveAt = performance.now();
      mx = e.clientX;
      my = e.clientY;

      if (hasLast) {
        const dist = Math.hypot(mx - lastX, my - lastY);
        if (Math.random() < Math.min(dist / 30, 0.6)) spawnSpark(mx, my);
        if (Math.random() < Math.min(dist / 180, 0.14)) {
          spawnLeaf(mx, my, { vy: -0.1 + Math.random() * 0.4 });
        }
      }
      lastX = mx;
      lastY = my;
      hasLast = true;
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      hoverEl = el && el.closest ? el.closest(INTERACTIVE) : null;
    };

    const onClick = (e: MouseEvent) => {
      bursts.push({ x: e.clientX, y: e.clientY, life: 1, rot: Math.random() });
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
        const sp = 1.6 + Math.random() * 2.4;
        spawnLeaf(e.clientX, e.clientY, {
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.6,
          decay: 0.014 + Math.random() * 0.008,
        });
      }
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        spawnSpark(e.clientX, e.clientY, {
          vx: Math.cos(a) * 3.2,
          vy: Math.sin(a) * 3.2,
          size: 3 + Math.random() * 3,
          decay: 0.035,
        });
      }
    };

    const onLeave = () => {
      visible = false;
      hasLast = false;
      hoverEl = null;
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("click", onClick);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}