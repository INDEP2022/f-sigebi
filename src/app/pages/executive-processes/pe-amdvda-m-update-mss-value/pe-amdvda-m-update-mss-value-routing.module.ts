import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAmdvdaCUpdateMssValueComponent } from './pe-amdvda-c-update-mss-value/pe-amdvda-c-update-mss-value.component';

const routes: Routes = [
  {
    path: '',
    component: PeAmdvdaCUpdateMssValueComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeAmdvdaMUpdateMssValueRoutingModule {}
