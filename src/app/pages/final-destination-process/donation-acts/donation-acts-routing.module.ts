import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationActsComponent } from './donation-acts/donation-acts.component';

const routes: Routes = [
  {
    path: '',
    component: DonationActsComponent,
    data: { Title: 'Actas de donación' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationActsRoutingModule {}
