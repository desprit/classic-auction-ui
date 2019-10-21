import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/modules/auth/auth.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  public items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Logout',
        command: (e: Event) => this.onLogoutClick(),
        disabled: !this.authService.loggedIn
      }
    ];
  }

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
