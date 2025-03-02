import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isMenuOpen = signal(false);
  authService = inject(AuthService);
  router = inject(Router);
  isAuthenticated = signal(this.authService.isAuthenticated());

  constructor() {

    effect(() => {
      this.isAuthenticated.set(this.authService.isAuthenticated());
    });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(state => !state);
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  logout(): void {
    this.authService.logoutUser().subscribe(() => {
      this.isAuthenticated.set(false); 
      this.router.navigate(['/welcome']);  
    });
  }
}
