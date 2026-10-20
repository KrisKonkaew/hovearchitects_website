import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  host: { style: 'display: contents' },
  template: `
    <header class="hdr" [class.over]="over()" [class.solid]="!over()">
      <a routerLink="/" class="logo-a"><img class="logo" [src]="over() ? 'logo-w.png' : 'logo-k.png'" alt="HOVE Architects"></a>
      <nav>
        <a routerLink="/projects" [class.on]="active() === 'projects'">Projects</a>
        <a routerLink="/about" [class.on]="active() === 'about'">About</a>
        <a routerLink="/contact" [class.on]="active() === 'contact'">Contact</a>
      </nav>
    </header>`,
})
export class Header {
  readonly over = input(true);
  readonly active = input('');
}
