import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
   router = inject(Router);
authService = inject(AuthService);
 fb = inject(FormBuilder);

  registerForm: FormGroup = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  errorMessage = signal<string>('');
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente.');
      return;
    }

    const userData = this.registerForm.value;

    this.authService.registerUser(userData).subscribe({
      next: () => {
        console.log('Registro completado');
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.errorMessage.set(error.error?.error || 'Error al registrarse. Inténtalo de nuevo.');
      }
    });
  }
  goToWelcome(): void {
    this.router.navigate(['/welcome']);
  }
  
}
