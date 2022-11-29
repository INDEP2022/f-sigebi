import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwAvaluosCResCancelValuationComponent } from './sw-avaluos-c-res-cancel-valuation/sw-avaluos-c-res-cancel-valuation.component';

const routes: Routes = [
  {
    path: '',
    component: SwAvaluosCResCancelValuationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwAvaluosMResCancelValuationRoutingModule {}
