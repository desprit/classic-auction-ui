import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseService } from './database.service';
import { DatabaseComponent } from './database.component';
import { SharedModule } from 'app/shared/shared.module';
import { SearchComponent } from './search/search.component';

@NgModule({
  providers: [DatabaseService],
  declarations: [DatabaseComponent, SearchComponent],
  imports: [SharedModule, CommonModule],
  exports: [SharedModule],
  entryComponents: []
})
export class DatabaseModule {}
