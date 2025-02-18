
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  router = inject(Router);
  isMenuOpen = false; 

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; 
  }

  goToLogin() : void {
    this.router.navigateByUrl('/login');
  }

  goToRegister() : void {
    this.router.navigateByUrl('/register');
  }
}
