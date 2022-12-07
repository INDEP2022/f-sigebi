import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintMassiveAccountComponent } from './print-massive-account/print-massive-account.component';

const routes: Routes = [
  {
    path: '',
    component: PrintMassiveAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintMassiveAccountsRoutingModule {}
