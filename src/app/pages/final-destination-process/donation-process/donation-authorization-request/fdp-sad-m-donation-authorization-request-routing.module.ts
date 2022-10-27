import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpSadCDonationAuthorizationRequestComponent } from './donation-authorization-request/fdp-sad-c-donation-authorization-request.component';

const routes: Routes = [
  {
    path: '',
    component: FdpSadCDonationAuthorizationRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpSadMDonationAuthorizationRequestRoutingModule {}
