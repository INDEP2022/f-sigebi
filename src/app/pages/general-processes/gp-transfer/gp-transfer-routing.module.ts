import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpTransferComponent } from './gp-transfer/gp-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: GpTransferComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpTransferRoutingModule {}
