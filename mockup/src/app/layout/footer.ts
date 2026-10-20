import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../core/data.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  host: { style: 'display: contents' },
  template: `
    <footer class="ftr">
      <div><img src="logo-k.png" style="height:44px" alt=""><p class="muted" style="margin:14px 0 0">Hove Architects Co., Ltd.<br>Bangkok, Thailand</p></div>
      <div><div class="eyebrow">Contact</div><span class="ph-txt">[ที่อยู่]<br>[อีเมล]<br>[โทรศัพท์]</span></div>
      <div><div class="eyebrow">Pages</div><a routerLink="/projects">Projects</a><br><a routerLink="/about">About</a><br><a routerLink="/contact">Contact</a></div>
      <div><div class="eyebrow">Follow</div><a [href]="data.facebook">Facebook</a></div>
      <div class="copy">© Hove Architects Co., Ltd. · Mockup (content and images from hovearchitects.com, exported 2026-10-19)</div>
    </footer>`,
})
export class Footer { readonly data = inject(DataService); }
