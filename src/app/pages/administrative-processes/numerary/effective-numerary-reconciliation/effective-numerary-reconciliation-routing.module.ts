import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectiveNumeraryReconciliationComponent } from './effective-numerary-reconciliation/effective-numerary-reconciliation.component';

const routes: Routes = [
  {
    path: '',
    component: EffectiveNumeraryReconciliationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EffectiveNumeraryReconciliationRoutingModule {}
