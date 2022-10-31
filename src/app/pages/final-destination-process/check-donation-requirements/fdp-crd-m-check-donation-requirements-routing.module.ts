import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpCrdCCheckDonationRequirementsComponent } from './check-donation-requirements/fdp-crd-c-check-donation-requirements.component';

const routes: Routes = [
  {
    path: '',
    component: FdpCrdCCheckDonationRequirementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpCrdMCheckDonationRequirementsRoutingModule {}
