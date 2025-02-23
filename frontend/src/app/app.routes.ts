import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MapComponent } from './components/map/map.component';
import { AuthGuard } from './guards/auth.guard'; 
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'map', component: MapComponent, canActivate: [AuthGuard] }, 
    {path : "calendar", component: CalendarComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'home' }
];
