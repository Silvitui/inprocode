import { EstatisticComponent } from './pages/estatistic/estatistic.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
    { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
    { path: 'map', loadComponent: () => import('./pages/map/map.component').then(m => m.MapComponent) },
    {path: 'estatistic', loadComponent: () => import('./pages/estatistic/estatistic.component').then(m => m.EstatisticComponent)},
    { path: '**', redirectTo: 'home' }
  ];
  
