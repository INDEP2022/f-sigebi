import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositConsiliationTokensComponent } from './deposit-consiliation-tokens/deposit-consiliation-tokens.component';

const routes: Routes = [
  {
    path: '',
    component: DepositConsiliationTokensComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositConsiliationTokensRoutingModule {}
