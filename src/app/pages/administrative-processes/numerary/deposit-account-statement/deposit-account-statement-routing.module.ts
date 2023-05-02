import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositAccountStatementComponent } from './deposit-account-statement/deposit-account-statement.component';

const routes: Routes = [
  {
    path: '',
    component: DepositAccountStatementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositAccountStatementRoutingModule {}
