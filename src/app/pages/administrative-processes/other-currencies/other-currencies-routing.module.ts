import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherCurrenciesComponent } from './other-currencies/other-currencies.component';

const routes: Routes = [
  {
    path: '',
    component: OtherCurrenciesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherCurrenciesRoutingModule {}
