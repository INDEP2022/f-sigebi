import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositTokensComponent } from './deposit-tokens/deposit-tokens.component';

const routes: Routes = [
  { path: 'deposit-tokens', component: DepositTokensComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryRoutingModule {}
