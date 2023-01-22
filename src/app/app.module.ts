import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppConfigService, initializerConfig} from "../config/app-config.service";
import {HttpClientModule} from "@angular/common/http";
import {TopBarComponent} from "./components/top-bar/top-bar.component";
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoffeesComponent} from "./components/coffees/coffees.component";
import {NgxPaginationModule} from "ngx-pagination";
import {StatisticsComponent} from "./components/statistics/statistics.component";
import {NgToastModule} from "ng-angular-popup";
import {SignUpComponent} from "./components/sign-up/sign-up.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {JwtModule} from "@auth0/angular-jwt";
import {UpdateBalanceComponent} from "./components/update-balance/update-balance.component";

/**
 * Получение токена доступа.
 */
export function tokenGetter() {
  return localStorage.getItem("accessToken");
}

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    CoffeesComponent,
    SignUpComponent,
    StatisticsComponent,
    SignInComponent,
    UpdateBalanceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPaginationModule,
    NgToastModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7046"],
        disallowedRoutes: []
      }
    })
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
export class AppModule {
}
