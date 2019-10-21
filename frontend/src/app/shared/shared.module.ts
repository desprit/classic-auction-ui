import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedService } from 'app/shared/services/shared.service';
import { ApiService } from './services/api.service';
import { HeaderComponent } from './components/header/header.component';
import { StringToGoldPipe } from './pipes/string-to-gold.pipe';
import { UnescapePipe } from './pipes/unescape.pipe';
import { AppPrimengModule } from 'app/core/app-primeng.module';

@NgModule({
  providers: [SharedService, ApiService],
  declarations: [HeaderComponent, StringToGoldPipe, UnescapePipe],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppPrimengModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    StringToGoldPipe,
    UnescapePipe,
    AppPrimengModule
  ]
})
export class SharedModule {}
