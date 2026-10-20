import { Injectable } from '@angular/core';
import raw from '../data/site-data.json';

export interface GalleryImage { src: string; ratio: number }
export interface Project {
  slug: string; no: string; categoryId: string; title: string; location: string;
  cover: string; coverFull: string; paras: string[]; facts: string[][];
  gallery: GalleryImage[][]; drawings: string[];
}
export interface Category { id: string; title: string; count: number }

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly facebook: string = raw.facebook;
  readonly heroImg: string = raw.heroImg;
  readonly about = raw.about as { paragraphs: string[]; images: string[] };
  readonly categories = raw.categories as Category[];
  readonly projects = raw.projects as Project[];
  readonly featured = raw.featured.map((s) => this.bySlug(s)!);

  bySlug(slug: string): Project | undefined { return this.projects.find((p) => p.slug === slug); }
  byCategory(id: string): Project[] { return this.projects.filter((p) => p.categoryId === id); }
  panelCover(catId: string): Project { return this.bySlug((raw.panelCover as Record<string, string>)[catId])!; }
  categoryTitle(id: string): string { return this.categories.find((c) => c.id === id)?.title ?? ''; }
  neighbours(p: Project): { prev: Project; next: Project } {
    const s = this.byCategory(p.categoryId), i = s.indexOf(p);
    return { prev: s[(i - 1 + s.length) % s.length], next: s[(i + 1) % s.length] };
  }
}
