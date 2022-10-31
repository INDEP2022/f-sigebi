import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpPddCDonationProcessesComponent } from './donation-processes/fdp-pdd-c-donation-processes.component';

const routes: Routes = [
  {
    path: '',
    component: FdpPddCDonationProcessesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpPddMDonationProcessesRoutingModule {}
