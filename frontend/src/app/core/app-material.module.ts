import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatTabsModule,
  MatTooltipModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatPaginatorModule,
  MatSelectModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MAT_DATE_LOCALE,
  MatAutocompleteModule,
  MatSidenavModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatChipsModule
} from '@angular/material';

@NgModule({
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    }
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    LayoutModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatChipsModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    LayoutModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatChipsModule
  ]
})
export class AppMaterialModule {}