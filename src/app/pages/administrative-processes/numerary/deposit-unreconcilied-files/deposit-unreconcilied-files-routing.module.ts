import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositUnreconciliedFilesComponent } from './deposit-unreconcilied-files/deposit-unreconcilied-files.component';

const routes: Routes = [
  {
    path: '',
    component: DepositUnreconciliedFilesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositUnreconciliedFilesRoutingModule {}
