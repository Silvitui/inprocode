import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthCredentials } from '../interfaces/authCredentials';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000/api/auth';
  http = inject(HttpClient);
  router = inject(Router);
  isAuthenticated = signal(false);
  redirectUrl: string | null = null;

  constructor() {
    this.checkAuthStatus(); 
  }
  checkAuthStatus(): void { 
    this.http.get<boolean>(`${this.apiUrl}/check-auth`, { withCredentials: true }).subscribe({
      next: (isAuthenticated) => this.isAuthenticated.set(isAuthenticated),
      error: () => this.isAuthenticated.set(false)
    });
  }

  registerUser(user: AuthCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { withCredentials: true }).pipe(
      tap(() => {
        console.log('Registro completado');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => error);
      })
    );
  }

  loginUser(credentials: Pick<AuthCredentials, 'email' | 'password'>): Observable<any> {// PICK se usa cuando necesitas seleccionar algunas propiedades (En este caso necesitamos solo email y password.)
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticated.set(true); 
        console.log('Login');
        const targetUrl = this.redirectUrl || '/welcome';
        this.redirectUrl = null;  
        this.router.navigateByUrl(targetUrl);
      }),
      catchError(error => {
        console.error(' Error en el login:', error);
        return throwError(() => error);
      })
    );
  }
  

  logoutUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticated.set(false); 
        console.log(' Logout exitoso');
        this.router.navigate(['/welcome']); 
      }),
      catchError(error => {
        console.error(' Error en el logout:', error);
        return throwError(() => error);
      })
    );
  }
}
