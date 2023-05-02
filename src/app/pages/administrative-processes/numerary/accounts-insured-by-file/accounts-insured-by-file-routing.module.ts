import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsInsuredByFileComponent } from './accounts-insured-by-file/accounts-insured-by-file.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsInsuredByFileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsInsuredByFileRoutingModule {}
