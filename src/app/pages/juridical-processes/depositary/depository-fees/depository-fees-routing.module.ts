import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositoryFeesComponent } from './depository-fees/depository-fees.component';

const routes: Routes = [
  {
    path: '',
    component: DepositoryFeesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositoryFeesRoutingModule {}
