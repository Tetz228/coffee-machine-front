import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {CoffeesComponent} from "./components/coffees/coffees.component";

const routes: Routes = [
  {path: 'coffees', title: 'Кофе', component: CoffeesComponent},
  {path: '**', redirectTo: 'coffees'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
