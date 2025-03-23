import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SimpleLayoutComponent } from './components/layout/simple-layout/simple-layout.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';



export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },

  // Rutas que usan fondo blur-up (login, register, about)
  {
    path: '',
    component: SimpleLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
      { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) },
    ]
  },

  // Ruta con fondo woods (welcome)
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'welcome', loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent) }
    ]
  },

  // Rutas con fondo BCN
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
