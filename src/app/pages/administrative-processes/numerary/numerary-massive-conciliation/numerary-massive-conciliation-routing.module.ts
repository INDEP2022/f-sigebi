import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryMassiveConciliationComponent } from './numerary-massive-conciliation/numerary-massive-conciliation.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraryMassiveConciliationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryMassiveConciliationRoutingModule {}
