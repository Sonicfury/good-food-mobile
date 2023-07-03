import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _baseUrl = `${environment.apiUrl}/login`;
  private _session: null | Session;
  private static readonly SESSION_KEY = 'session';

  constructor(private _http: HttpClient) {
    const localSession = localStorage.getItem(AuthService.SESSION_KEY);
    this._session = localSession ? JSON.parse(localSession) as Session : null;
  }

  login(email: string, password: string): Observable<Session> {

    return this._http.post<{ success: boolean, data: Session, message: string }>(this._baseUrl, { email, password })
      .pipe(
        tap(resp => this.session = resp?.data),
        map(resp => resp?.data)
      )
  }

  logout() {
    this.session = null;
  }

  isAuthenticated(): boolean {
    return this._session !== null;
  }

  private set session(value: Session | null) {
    this._session = value;
    localStorage.setItem(AuthService.SESSION_KEY, JSON.stringify(value))
  }

  get session(): Session | null {
    return this._session;
  }
}
