import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LoginRequestPayload } from '../../../../../shared/models/auth.model';
import { ApiService } from 'app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public role: string;
  public loggedIn: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {
    this.loggedIn = !!localStorage.getItem('authToken');
    this.role = localStorage.getItem('role');
  }

  public login(payload: LoginRequestPayload) {
    this.apiService.login(payload).subscribe(resp => {
      if (resp.success) {
        localStorage.setItem('authToken', resp.data.token);
        localStorage.setItem('role', resp.data.role);
        this.loggedIn = true;
        this.role = resp.data.role;
        this.router.navigate(['upload']);
      }
    });
  }

  public logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.loggedIn = false;
    this.role = null;
    this.router.navigate(['auth']);
  }
}
