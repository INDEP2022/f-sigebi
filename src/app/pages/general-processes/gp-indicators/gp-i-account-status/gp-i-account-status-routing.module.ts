import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIAccountStatusComponent } from './gp-i-account-status/gp-i-account-status.component';

const routes: Routes = [
  {
    path: '',
    component: GpIAccountStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIAccountStatusRoutingModule {}
