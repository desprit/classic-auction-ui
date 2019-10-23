import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableControlsComponent } from './table-controls/table-controls.component';
import { BuyingService } from './buying.service';
import { BuyingComponent } from './buying.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  providers: [BuyingService],
  declarations: [TableControlsComponent, BuyingComponent],
  imports: [SharedModule, CommonModule],
  exports: [SharedModule]
})
export class BuyingModule {}
