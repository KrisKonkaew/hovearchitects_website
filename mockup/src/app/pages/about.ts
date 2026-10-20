import { Component, inject } from '@angular/core';
import { DataService } from '../core/data.service';
import { MOTION } from '../core/motion';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

@Component({
  selector: 'app-about',
  imports: [Header, Footer, ...MOTION],
  template: `
    <app-header [over]="false" active="about" />
    <section class="trio">
      @for (src of data.about.images; track src; let k = $index) {
        <div class="hv trio-i"><img [src]="src" alt="" loading="lazy" [parallaxImg]="0.1 + k * 0.06"></div>
      }
    </section>
    <section class="wrap ab reveal">
      <div><div class="eyebrow">Studio</div><h1 class="display" style="font-size:64px;margin-top:12px">About</h1></div>
      <div><p class="lead">{{ data.about.paragraphs[0] }}</p>
        <div class="prose two">@for (t of data.about.paragraphs.slice(1); track $index) { <p>{{ t }}</p> }</div></div>
    </section>
    <section class="wrap ph-s"><div class="ph">[ทีม / ผู้ก่อตั้ง: รอข้อมูลลูกค้า]</div><div class="ph">[How we work และ FAQ: รอข้อมูลลูกค้า]</div></section>
    <app-footer />`,
})
export class About { readonly data = inject(DataService); }
