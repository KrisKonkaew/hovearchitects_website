import { Component, inject } from '@angular/core';
import { DataService } from '../core/data.service';
import { MOTION } from '../core/motion';
import { Header } from '../layout/header';
import { Footer } from '../layout/footer';

@Component({
  selector: 'app-contact',
  imports: [Header, Footer, ...MOTION],
  template: `
    <app-header [over]="false" active="contact" />
    <section class="wrap ab reveal" style="padding-top:150px">
      <div><div class="eyebrow">Studio</div><h1 class="display" style="font-size:64px;margin-top:12px">Contact</h1></div>
      <dl class="facts4 one">
        <div><dt class="eyebrow">Studio</dt><dd>Hove Architects Co., Ltd.</dd></div>
        <div><dt class="eyebrow">Address</dt><dd class="ph-txt">[ที่อยู่: รอยืนยัน]</dd></div>
        <div><dt class="eyebrow">Email</dt><dd class="ph-txt">[อีเมล: รอยืนยัน]</dd></div>
        <div><dt class="eyebrow">Phone</dt><dd class="ph-txt">[โทรศัพท์: รอยืนยัน]</dd></div>
        <div><dt class="eyebrow">Facebook</dt><dd><a class="link" [href]="data.facebook">facebook.com/hove.architects</a></dd></div>
      </dl>
    </section>
    <app-footer />`,
})
export class Contact { readonly data = inject(DataService); }
