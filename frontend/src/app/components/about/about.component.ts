import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
   router = inject(Router);
  goToWelcome(): void {
    this.router.navigate(['/welcome']);
  }
}
