import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  router = inject(Router);
  authService = inject(AuthService);
  isMenuOpen = false;
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  logout(): void {
    this.authService.logoutUser().subscribe(); 
  }
}
