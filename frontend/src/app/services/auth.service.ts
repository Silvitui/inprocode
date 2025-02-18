import { AuthCredentials } from './../interfaces/authCredentials';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private http = inject(HttpClient);
  registerUser(user: AuthCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => error);
      })
    );
  }
  

  loginUser(credentials: Pick<AuthCredentials, 'email' | 'password'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error en el login:', error);
        return throwError(() => error);
      })
    );
  }

  logoutUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error en el logout:', error);
        return throwError(() => error);
      })
    );
  }
}
