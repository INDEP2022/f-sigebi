import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBPdpEcCConciliationExecutionMainComponent } from './c-b-pdp-ec-c-conciliation-execution-main/c-b-pdp-ec-c-conciliation-execution-main.component';

const routes: Routes = [
  {
    path: ':goodType',
    component: CBPdpEcCConciliationExecutionMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBPdpEcMConciliationExecutionRoutingModule {}
