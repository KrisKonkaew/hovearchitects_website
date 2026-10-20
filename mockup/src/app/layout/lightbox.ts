import { Component, inject } from '@angular/core';
import { Lightbox } from './lightbox.service';

@Component({
  selector: 'app-lightbox',
  host: { '(document:keydown.escape)': 'box.src.set(null)' },
  template: `
    @if (box.src(); as s) {
      <div class="lb" (click)="box.src.set(null)">
        <button class="lb-x" aria-label="Close">×</button><img [src]="s" alt=""><div class="lb-cap"></div>
      </div>
    }`,
})
export class LightboxView { readonly box = inject(Lightbox); }
