import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div fxLayout="column">
      <app-header></app-header>
      <div class="main">
        <router-outlet></router-outlet>
      </div>
      <app-footer fxFlexOffset="auto"></app-footer>
    </div>
  `,
  styles: ['.main { min-height: calc(100vh - 128px); }']
})
export class AppComponent {
  title = 'need-more-gold';
}
