import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [HttpClientModule, SharedModule],
  exports: [],
  providers: []
})
export class CoreModule {}