import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/modules/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {}

  public onLogoutClick() {
    this.authService.logout();
  }

  public onLogoClick() {
    this.router.navigate(['database']);
  }

  public onLinkClick(pathName: string) {
    this.router.navigate([pathName]);
  }
}
