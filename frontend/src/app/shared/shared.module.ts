import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppMaterialModule } from 'app/core/app-material.module';
import { SharedService } from 'app/shared/services/shared.service';
import { ApiService } from './services/api.service';

@NgModule({
  providers: [SharedService, ApiService],
  declarations: [],
  imports: [
    FlexLayoutModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}