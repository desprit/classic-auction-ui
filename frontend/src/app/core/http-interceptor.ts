import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let baseUrl: string;
    if (environment.production) {
      baseUrl = 'http://35.198.147.242/v1/';
    } else {
      baseUrl = 'http://127.0.0.1:3031/v1/';
    }
    const apiReq = req.clone({ url: `${baseUrl}${req.url}` });
    return next.handle(apiReq);
  }
}
