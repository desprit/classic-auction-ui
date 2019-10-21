import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellingService } from './selling.service';
import { SellingComponent } from './selling.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  providers: [SellingService],
  declarations: [SellingComponent],
  imports: [SharedModule, CommonModule],
  exports: [SharedModule],
  entryComponents: []
})
export class SellingModule {}
