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
  private _session: null | Session = null;

  constructor(private _http: HttpClient) {
  }

  login(email: string, password: string): Observable<Session> {

    return this._http.post<{ success: boolean, data: Session, message: string }>(this._baseUrl, { email, password })
      .pipe(
        tap(resp => this._session = resp?.data),
        map(resp => resp?.data)
      )
  }

  isAuthenticated(): boolean {
    return this._session !== null;
  }
}
