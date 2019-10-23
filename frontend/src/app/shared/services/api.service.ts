import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { ApiResponse } from 'app/../../../backend/src/shared/models/api.model';
import {
  LoginRequestPayload,
  LoginResponse
} from 'app/../../../backend/src/shared/models/auth.model';
import {
  WowAHItem,
  SearchResponse,
  WowBuyingItem
} from '../../../../../backend/src/shared/models/item.model';

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

  public search(query: string): Observable<ApiResponse> {
    const payload = { query };
    return this.httpClient.post('search', payload).pipe(
      catchError(e => {
        console.error(e);
        return of({ status: 'error' });
      }),
      map((response: any) => {
        return response;
      })
    );
  }

  public getItems(
    page: number,
    onlyLatest: boolean
  ): Observable<{ items: WowAHItem[]; totalItems: number }> {
    return this.httpClient
      .get(`items?page=${page}&onlyLatest=${onlyLatest}`)
      .pipe(
        catchError(e => {
          console.error(e);
          return of({ items: [], totalItems: 0 });
        }),
        map((response: any) => {
          return response.data;
        })
      );
  }

  public getUpdateTime(): Observable<string> {
    return this.httpClient.get('items/updated-time').pipe(
      catchError(e => {
        console.error(e);
        return of(null);
      }),
      map((response: any) => {
        return response.data;
      })
    );
  }

  public getBuyingList(
    query: string,
    page: number
  ): Observable<{ items: WowBuyingItem[]; totalItems: number }> {
    return this.httpClient.get(`items/buying?page=${page}&query=${query}`).pipe(
      catchError(e => {
        console.error(e);
        return of({ items: [], totalItems: 0 });
      }),
      map((response: any) => {
        return response.data;
      })
    );
  }

  public getSuggesntions(query: string): Observable<string[]> {
    const queryLowerCase = query.toLowerCase();
    return this.httpClient
      .get(`items/autocomplete?query=${queryLowerCase}`)
      .pipe(
        catchError(e => {
          console.error(e);
          return of([]);
        }),
        map((response: any) => {
          return response.data;
        })
      );
  }
}
