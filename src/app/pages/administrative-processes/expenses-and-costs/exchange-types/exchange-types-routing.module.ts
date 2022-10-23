import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeTypesComponent } from './exchange-types/exchange-types.component';

const routes: Routes = [
  {
    path: '',
    component: ExchangeTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExchangeTypesRoutingModule {}
