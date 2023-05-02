import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountStatusComponent } from './account-status/account-status.component';

const routes: Routes = [
  {
    path: '',
    component: AccountStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountStatusRoutingModule {}
