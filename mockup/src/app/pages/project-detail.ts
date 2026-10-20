import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DataService } from '../core/data.service';
import { MOTION } from '../core/motion';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';
import { Lightbox } from '../layout/lightbox.service';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, Header, Footer, ...MOTION],
  template: `
    @if (p(); as p) {
      <section class="hero proj" id="hero">
        <app-header [over]="true" active="projects" />
        <div class="hero-bg" [parallax]="-0.28"><img [src]="p.coverFull" [alt]="p.title"></div><div class="hero-shade"></div>
        <div class="wrap hero-txt" [parallax]="0.2">
          <div class="eyebrow w">{{ p.no }} · {{ data.categoryTitle(p.categoryId) }}</div>
          <h1 class="display">{{ p.title }}</h1>
          <div class="eyebrow w" style="margin-top:14px">{{ p.location }}</div>
        </div>
        <div class="scroll-hint eyebrow w">Scroll</div>
      </section>

      <section class="wrap lead-s reveal"><p class="lead big">{{ p.paras[0] }}</p></section>
      <section class="wrap facts-s reveal">
        <dl class="facts4">@for (f of p.facts; track f[0]) { <div><dt class="eyebrow">{{ f[0] }}</dt><dd>{{ f[1] }}</dd></div> }</dl>
        @if (p.paras.length > 1) { <div class="prose">@for (t of p.paras.slice(1); track $index) { <p>{{ t }}</p> }</div> }
      </section>

      <section class="gallery wrap">
        @for (row of p.gallery; track $index) {
          <div class="grow" [class.solo]="row.length === 1 && row[0].ratio <= 1.2">
            @for (g of row; track g.src) {
              <figure class="gi hv" [style.--r]="g.ratio" (click)="box.src.set(g.src)">
                <img [src]="g.src" [alt]="p.title + ' — image'" loading="lazy" [parallaxImg]="0.06">
              </figure>
            }
          </div>
        }
      </section>

      @if (p.drawings.length) {
        <section class="wrap drawings">
          <div class="eyebrow" style="border-top:1px solid var(--ink);padding-top:18px;margin-bottom:18px">Drawings and diagrams</div>
          <div class="dgrid">@for (d of p.drawings; track d) { <figure class="di" (click)="box.src.set(d)"><img [src]="d" [alt]="p.title + ' drawing'" loading="lazy"></figure> }</div>
        </section>
      }

      <section class="nextp">
        <div class="panel-bg hv" [parallax]="-0.18"><img [src]="nb().next.coverFull" alt="" loading="lazy"></div><div class="panel-shade"></div>
        <div class="panel-in">
          <span class="eyebrow w">Next sheet — {{ nb().next.no }}</span>
          <a class="pill w big" [routerLink]="['/projects', nb().next.slug]">{{ nb().next.title }} →</a>
          <a class="eyebrow w" [routerLink]="['/projects', nb().prev.slug]">← Prev: {{ nb().prev.no }} {{ nb().prev.title }}</a>
        </div>
      </section>
      <app-footer />
    }`,
})
export class ProjectDetail {
  readonly data = inject(DataService);
  readonly box = inject(Lightbox);
  private slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map((m) => m.get('slug')!)));
  readonly p = computed(() => this.data.bySlug(this.slug()!));
  readonly nb = computed(() => this.data.neighbours(this.p()!));
  constructor() {
    const router = inject(Router), title = inject(Title);
    // unknown slug -> home; known slug -> page title
    setTimeout(() => {
      const p = this.p();
      if (!p) router.navigateByUrl('/'); else title.setTitle(`${p.title} — HOVE Architects`);
    });
  }
}
