import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmGeCdcClcCCalculateCommissionComponent } from './c-bm-ge-cdc-clc-c-calculate-commission/c-bm-ge-cdc-clc-c-calculate-commission.component';

const routes: Routes = [
  {
    path: '',
    component: CBmGeCdcClcCCalculateCommissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBmGeCdcClcMCalculateCommissionRoutingModule { }
