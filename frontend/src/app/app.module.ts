import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { AuthService } from "./modules/auth/auth.service";
import { HeaderComponent } from "./shared/components/header/header.component";
import { AuthModule } from "./modules/auth/auth.module";
import { UploadModule } from "./modules/upload/upload.module";
import { AppPrimengModule } from "./core/app-primeng.module";
import { BuyingModule } from "./modules/buying/buying.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BuyingModule,
    UploadModule,
    AuthModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    AppPrimengModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent, HeaderComponent]
})
export class AppModule {}
