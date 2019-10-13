import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppMaterialModule } from './core/app-material.module';
import { AuthService } from './modules/auth/auth.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DatabaseModule } from './modules/database/database.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    UploadModule,
    DatabaseModule,
    AuthModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AppMaterialModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent, HeaderComponent, FooterComponent]
})
export class AppModule {}
