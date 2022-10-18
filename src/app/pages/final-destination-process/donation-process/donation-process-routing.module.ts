import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'export-goods-donation',
    loadChildren: () =>
      import(
        './export-goods-donation/fdp-ebde-m-export-goods-donation.module'
      ).then(m => m.FdpEbdeMExportGoodsDonationModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationProcessRoutingModule {}
