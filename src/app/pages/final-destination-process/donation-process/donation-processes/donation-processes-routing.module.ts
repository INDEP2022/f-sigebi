import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationProcessesComponent } from './donation-processes/donation-processes.component';

const routes: Routes = [
  {
    path: '',
    component: DonationProcessesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationProcessesRoutingModule {}
