import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../core/data.service';
import { MOTION } from '../core/motion';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, Header, Footer, ...MOTION],
  template: `
    <section class="band">
      <app-header [over]="true" active="projects" />
      <div class="band-bg" [parallax]="-0.25"><img [src]="data.bySlug('bangkok-boulevard-bangna-km12')!.coverFull" alt=""></div>
      <div class="hero-shade"></div>
      <div class="wrap band-txt"><div class="eyebrow w">{{ data.projects.length }} projects</div><h1 class="display">Projects</h1></div>
    </section>
    <div class="filterbar"><div class="wrap"><div class="frow">
      <span class="eyebrow">Category</span>
      <div class="pills" id="catpills">
        <button class="pill" [class.on]="cat() === 'all'" (click)="pick('all')">All</button>
        @for (c of data.categories; track c.id) {
          <button class="pill" [class.on]="cat() === c.id" (click)="pick(c.id)">{{ c.title }}</button>
        }
      </div>
    </div></div></div>
    <section class="wrap plist">
      @for (c of data.categories; track c.id) {
        <div class="pgroup" [style.display]="cat() === 'all' || cat() === c.id ? '' : 'none'">
          <div class="ghead"><h2 class="h2">{{ c.title }}</h2><span class="eyebrow">{{ pad(c.count) }} works</span></div>
          <div class="grid">
            @for (p of data.byCategory(c.id); track p.slug) {
              <a class="pcard" [routerLink]="['/projects', p.slug]">
                <div class="pimg hv"><img [src]="p.cover" [alt]="p.title" loading="lazy"></div>
                <div class="pmeta"><span class="num" style="font-size:18px">{{ p.no }}</span>
                  <div><p class="label">{{ p.title }}</p><div class="eyebrow">{{ p.location }}</div></div></div>
              </a>
            }
          </div>
        </div>
      }
    </section>
    <app-footer />`,
})
export class Projects {
  readonly data = inject(DataService);
  private route = inject(ActivatedRoute);
  readonly cat = signal('all');
  constructor() {
    this.route.fragment.subscribe((f) => this.cat.set(this.data.categories.some((c) => c.id === f) ? f! : 'all'));
  }
  pick(id: string) { this.cat.set(id); history.replaceState(null, '', id === 'all' ? location.pathname : '#' + id); }
  pad(n: number) { return String(n).padStart(2, '0'); }
}
