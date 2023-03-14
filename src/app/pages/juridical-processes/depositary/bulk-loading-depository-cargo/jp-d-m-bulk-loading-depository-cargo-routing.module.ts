import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDBldcCBulkLoadingDepositoryCargoComponent } from './jp-d-bldc-c-bulk-loading-depository-cargo/jp-d-bldc-c-bulk-loading-depository-cargo.component';

const routes: Routes = [
  {
    path: '',
    component: JpDBldcCBulkLoadingDepositoryCargoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMBulkLoadingDepositoryCargoRoutingModule {}
