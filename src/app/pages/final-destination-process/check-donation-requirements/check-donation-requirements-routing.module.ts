import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckDonationRequirementsComponent } from './check-donation-requirements/check-donation-requirements.component';

const routes: Routes = [
  {
    path: '',
    component: CheckDonationRequirementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckDonationRequirementsRoutingModule {}
