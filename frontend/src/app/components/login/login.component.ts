import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
   router = inject(Router);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  errorMessage = signal<string>('');

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente.');
      return;
    }
  
    const credentials = this.loginForm.value; 
  
    this.authService.loginUser(credentials).subscribe({
      next: () => {
        console.log('Login exitoso');
       
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage.set('Error al iniciar sesión. Verifica tus credenciales.');
      }
    });
  }
  goToWelcome(): void {
    this.router.navigate(['/welcome']);
  }
  
}
