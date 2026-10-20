import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class Lightbox { readonly src = signal<string | null>(null); }
