import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { ApiResponse } from 'app/../../../shared/models/api.model';
import {
  LoginRequestPayload,
  LoginResponse
} from 'app/../../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  public login(payload: LoginRequestPayload): Observable<LoginResponse> {
    return this.httpClient.post('auth/login', payload).pipe(
      catchError(e => {
        console.error(e);
        return of({ status: 'error' });
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  public logout(): Observable<ApiResponse> {
    return this.httpClient.get('auth/logout').pipe(
      catchError(e => {
        console.error(e);
        return of({ status: 'error' });
      }),
      map((response: any) => {
        return response;
      })
    );
  }
}
