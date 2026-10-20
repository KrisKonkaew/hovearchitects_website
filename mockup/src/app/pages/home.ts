import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../core/data.service';
import { MOTION } from '../core/motion';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Footer, ...MOTION],
  template: `
    <section class="hero" id="hero">
      <app-header [over]="true" />
      <div class="hero-bg" [parallax]="-0.28"><img [src]="data.heroImg" alt="Bangkok Boulevard Signature Ramintra-Prayasuren"></div>
      <div class="hero-shade"></div>
      <div class="wrap hero-txt" [parallax]="0.22">
        <div class="eyebrow w">Bangkok-based design studio</div>
        <h1 class="display">Hove Architects</h1>
        <div class="hero-row">
          <span class="eyebrow w">08 · Bangkok Boulevard Signature Ramintra-Prayasuren</span>
          <a class="pill w" [routerLink]="['/projects', 'bangkok-boulevard-signature-ramintra-prayasuren']">View project →</a>
        </div>
      </div>
      <div class="scroll-hint eyebrow w">Scroll</div>
    </section>

    <section class="wrap intro reveal">
      <div class="eyebrow">Studio</div>
      <div><p class="lead">{{ data.about.paragraphs[0] }}</p><p style="margin-top:28px"><a class="link label" routerLink="/about">About the studio →</a></p></div>
    </section>

    <section class="selected" id="selected">
      <div class="wrap"><div class="sec-head reveal"><h2 class="h2">Selected projects</h2><span class="eyebrow">Hover to open · click to view</span></div></div>
      <div class="acc wrap" id="acc">
        @for (p of data.featured; track p.slug; let i = $index) {
          <a class="acc-it" [class.open]="open() === i" [routerLink]="['/projects', p.slug]" (mouseenter)="open.set(i)">
            <img [src]="p.coverFull" [alt]="p.title" loading="lazy"><span class="acc-shade"></span>
            <span class="acc-meta"><span class="num w">{{ p.no }}</span><b>{{ p.title }}</b><em>{{ p.location }}</em></span>
          </a>
        }
      </div>
    </section>

    @for (c of data.categories; track c.id; let i = $index) {
      <section class="panel">
        <div class="panel-bg hv" [parallax]="-0.2"><img [src]="data.panelCover(c.id).coverFull" [alt]="c.title" loading="lazy"></div>
        <div class="panel-shade"></div>
        <a class="panel-in" routerLink="/projects" [fragment]="c.id">
          <span class="eyebrow w">0{{ i + 1 }} — {{ pad(c.count) }} works</span><span class="pill w big">{{ c.title }}</span>
        </a>
      </section>
    }
    <app-footer />`,
})
export class Home {
  readonly data = inject(DataService);
  readonly open = signal(2);
  pad(n: number) { return String(n).padStart(2, '0'); }
}
