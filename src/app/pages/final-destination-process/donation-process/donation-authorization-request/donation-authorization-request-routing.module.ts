import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationAuthorizationRequestComponent } from './donation-authorization-request/donation-authorization-request.component';

const routes: Routes = [
  {
    path: '',
    component: DonationAuthorizationRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationAuthorizationRequestRoutingModule {}
