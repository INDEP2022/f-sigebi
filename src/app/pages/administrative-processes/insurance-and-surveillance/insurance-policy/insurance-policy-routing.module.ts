import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsurancePolicyComponent } from './insurance-policy.component';

const routes: Routes = [
  {
    path: '',
    component: InsurancePolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsurancePolicyRoutingModule {}
