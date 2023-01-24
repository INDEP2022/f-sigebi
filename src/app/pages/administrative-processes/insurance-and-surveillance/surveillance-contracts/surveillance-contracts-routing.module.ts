import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceContractsComponent } from './surveillance-contracts/surveillance-contracts.component';

const routes: Routes = [
  {
    path: '',
    component: SurveillanceContractsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceContractsRoutingModule {}
