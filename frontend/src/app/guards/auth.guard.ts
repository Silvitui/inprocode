import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authService = inject(AuthService);
 router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {  
      return true; // Si está logueado lo dejamos pasasr 
    }

    this.router.navigate(['/login']); 
    return false;
  }
}
