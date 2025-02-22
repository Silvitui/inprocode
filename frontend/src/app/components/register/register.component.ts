import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

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
        console.log('✅ Registro exitoso');
        this.router.navigate(['/login']); // 🔥 Redirigir al login tras registrarse
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.errorMessage.set(error.error?.error || 'Error al registrarse. Inténtalo de nuevo.');
      }
    });
  }
}
