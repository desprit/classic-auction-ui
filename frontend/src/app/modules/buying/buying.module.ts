import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableControlsComponent } from './table-controls/table-controls.component';
import { BuyingService } from './buying.service';
import { BuyingComponent } from './buying.component';
import { SharedModule } from 'app/shared/shared.module';
import { DataRowComponent } from './data-row/data-row.component';

@NgModule({
  providers: [BuyingService],
  declarations: [TableControlsComponent, BuyingComponent, DataRowComponent],
  imports: [SharedModule, CommonModule],
  exports: [SharedModule]
})
export class BuyingModule {}
