import { Directive, ElementRef, Injectable, OnDestroy, OnInit, inject, input } from '@angular/core';

/** One shared scroll/resize listener; directives register a per-frame update. */
@Injectable({ providedIn: 'root' })
export class Motion {
  readonly reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  private readonly subs = new Set<() => void>();
  private ticking = false;
  constructor() {
    if (!this.reduce) {
      addEventListener('scroll', () => this.queue(), { passive: true });
      addEventListener('resize', () => this.queue());
    }
  }
  add(fn: () => void) { if (this.reduce) return; this.subs.add(fn); fn(); }
  remove(fn: () => void) { this.subs.delete(fn); }
  private queue() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.ticking = false; this.subs.forEach((f) => f()); });
  }
}

/** Element moves k × its parent's distance from the viewport centre (negative = slower). Hero text also fades. */
@Directive({ selector: '[parallax]' })
export class Parallax implements OnInit, OnDestroy {
  readonly parallax = input.required<number | string>();
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private motion = inject(Motion);
  private fn = () => {
    const vh = innerHeight, r = this.el.parentElement!.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    let y = -((r.top + r.height / 2) - vh / 2) * +this.parallax();
    if (this.el.classList.contains('hero-txt')) {
      const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.7)));
      this.el.style.opacity = String(1 - p * 0.9);
      y = -r.top * 0.22;
    }
    this.el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
  };
  ngOnInit() { this.motion.add(this.fn); }
  ngOnDestroy() { this.motion.remove(this.fn); }
}

/** An image inside a clipped frame slides vertically by k. */
@Directive({ selector: '[parallaxImg]' })
export class ParallaxImg implements OnInit, OnDestroy {
  readonly parallaxImg = input.required<number | string>();
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private motion = inject(Motion);
  private fn = () => {
    const vh = innerHeight, r = this.el.parentElement!.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    const d = (r.top + r.height / 2) - vh / 2;
    this.el.style.transform = `translate3d(0,${(-d * +this.parallaxImg()).toFixed(1)}px,0) scale(1.14)`;
  };
  ngOnInit() { this.motion.add(this.fn); }
  ngOnDestroy() { this.motion.remove(this.fn); }
}

/** Adds .in when scrolled into view. */
@Directive({ selector: '.reveal' })
export class Reveal implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;
  ngOnInit() {
    if (!('IntersectionObserver' in window)) { this.el.classList.add('in'); return; }
    this.io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { this.el.classList.add('in'); this.io!.disconnect(); }
    }), { threshold: 0.12 });
    this.io.observe(this.el);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}

/** The image inside follows the mouse (subtle pan + zoom). */
@Directive({
  selector: '.hv',
  host: { '(mousemove)': 'move($event)', '(mouseleave)': 'leave()' },
})
export class HoverPan {
  private el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private motion = inject(Motion);
  move(e: MouseEvent) {
    const im = this.el.querySelector('img');
    if (!im || !this.motion.fine || this.motion.reduce) return;
    const r = this.el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    const base = this.el.classList.contains('gi') || this.el.classList.contains('trio-i') ? 1.14 : 1.08;
    im.style.transition = 'transform .25s ease-out';
    im.style.transform = `translate3d(${(-x * 28).toFixed(1)}px,${(-y * 28).toFixed(1)}px,0) scale(${base})`;
  }
  leave() {
    const im = this.el.querySelector('img');
    if (!im) return;
    im.style.transition = 'transform 1.2s cubic-bezier(.2,.7,.2,1)';
    im.style.transform = '';
  }
}

export const MOTION = [Parallax, ParallaxImg, Reveal, HoverPan] as const;
