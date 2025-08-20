import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface LoginResponse { access_token: string }
interface LoginDto { email: string; password: string }
interface SignupDto extends LoginDto { contact: string; address: string }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenKey = 'jwt';
  isAuthed$ = new BehaviorSubject<boolean>(!!sessionStorage.getItem(this.tokenKey));

  login(data: LoginDto) {
    return this.http.post<any>('http://localhost:3000/auth/login', data).pipe(
      tap(res => {
        if (!res.error && res.data?.[0]?.access_token) {
          sessionStorage.setItem(this.tokenKey, res.data[0].access_token);
          this.isAuthed$.next(true);
        }
      })
    );
  }

  signup(data: SignupDto) {
    return this.http.post<any>('http://localhost:3000/auth/signup', data);
  }

  logout() { sessionStorage.removeItem(this.tokenKey); this.isAuthed$.next(false); }
  get token() { return sessionStorage.getItem(this.tokenKey); }
}
