import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAddCDonationActsComponent } from './donation-acts/fdp-add-c-donation-acts.component';

const routes: Routes = [
  {
    path: "",
    component: FdpAddCDonationActsComponent,
    data: { Title: 'Actas de donación' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdpAddMDonationActsRoutingModule { }
