import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpEbdeCExportGoodsDonationComponent } from './export-goods-donation/fdp-ebde-c-export-goods-donation.component';

const routes: Routes = [
  {
    path: '',
    component: FdpEbdeCExportGoodsDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpEbdeMExportGoodsDonationRoutingModule {}
