import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './layout/layout/layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },

  // Ruta con fondo woods
  { 
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'welcome', loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent) }
    ]
  },

// Rutas con fondo bcn 
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: 'map', 
        loadComponent: () => import('./components/map/map-container/map-container.component').then(m => m.MapContainerComponent),
        canActivate: [AuthGuard]
      },
      { 
        path: 'calendar', 
        loadComponent: () => import('./components/calendary/calendary.component').then(m => m.CalendaryComponent),
        canActivate: [AuthGuard]
      }
    ]
  },

  { path: '**', redirectTo: 'welcome' }
];
