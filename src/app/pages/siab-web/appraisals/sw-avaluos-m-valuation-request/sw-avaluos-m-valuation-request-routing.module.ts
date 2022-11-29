import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwAvaluosCValuationRequestComponent } from './sw-avaluos-c-valuation-request/sw-avaluos-c-valuation-request.component';

const routes: Routes = [
  {
    path: '',
    component: SwAvaluosCValuationRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwAvaluosMValuationRequestRoutingModule {}
