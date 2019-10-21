import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './modules/auth/auth.component';
import { UploadComponent } from './modules/upload/upload.component';
import { AuthGuard } from './modules/auth/auth.guard';
import { DatabaseComponent } from './modules/database/database.component';
import { SellingComponent } from './modules/selling/selling.component';
import { BuyingComponent } from './modules/buying/buying.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'database',
    canActivate: [AuthGuard],
    component: DatabaseComponent
  },
  {
    path: 'selling',
    canActivate: [AuthGuard],
    component: SellingComponent
  },
  {
    path: 'buying',
    canActivate: [AuthGuard],
    component: BuyingComponent
  },
  {
    path: 'upload',
    canActivate: [AuthGuard],
    component: UploadComponent
  },
  {
    path: '**',
    redirectTo: 'upload',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
