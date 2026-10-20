import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LightboxView } from './layout/lightbox';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LightboxView],
  template: `<router-outlet /><app-lightbox />`,
})
export class App {
  constructor() { document.documentElement.classList.add('js'); }
}
