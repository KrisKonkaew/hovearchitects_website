import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'HOVE Architects — Projects', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'projects', title: 'Projects — HOVE Architects', loadComponent: () => import('./pages/projects').then((m) => m.Projects) },
  { path: 'projects/:slug', loadComponent: () => import('./pages/project-detail').then((m) => m.ProjectDetail) },
  { path: 'about', title: 'About — HOVE Architects', loadComponent: () => import('./pages/about').then((m) => m.About) },
  { path: 'contact', title: 'Contact — HOVE Architects', loadComponent: () => import('./pages/contact').then((m) => m.Contact) },
  { path: '**', redirectTo: '' },
];
