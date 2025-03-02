import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';  

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  {path: '',component: LayoutComponent,
    children: [
      { path: 'welcome', loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent) },
      { 
        path: 'map', 
        loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent),
        canActivate: [AuthGuard]  
      },
      { 
        path: 'calendar', 
        loadComponent: () => import('./components/calendar/calendar.component').then(m => m.CalendarComponent),
        canActivate: [AuthGuard] 
      }
    ]
  },
  { path: '**', redirectTo: 'welcome' }
];
