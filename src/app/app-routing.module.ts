import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CoffeesComponent} from "./components/coffees/coffees.component";
import {StatisticsComponent} from "./components/statistics/statistics.component";
import {SignUpComponent} from "./components/sign-up/sign-up.component";

const routes: Routes = [
  {path: 'coffees', title: 'Кофе', component: CoffeesComponent},
  {path: 'statistics', title: 'Статистики', component: StatisticsComponent},
  {path: 'sign-up', title: 'Регистрация', component: SignUpComponent},
  {path: '**', redirectTo: 'coffees'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
