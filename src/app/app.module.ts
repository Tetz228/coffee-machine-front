import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppConfigService, initializerConfig} from "../config/app-config.service";
import {HttpClientModule} from "@angular/common/http";
import {TopBarComponent} from "./components/top-bar/top-bar.component";

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [AppConfigService],
    useFactory: initializerConfig
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
