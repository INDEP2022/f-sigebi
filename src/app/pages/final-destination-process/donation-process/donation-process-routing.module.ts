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
  {
    path: 'web-donation-inventories',
    loadChildren: () =>
      import(
        './proposal-inventories-donation/website-donation-proposal/fdp-pidd-m-direct-donation-inventory.module'
      ).then(m => m.FdpPiddMDirectDonationInventoryModule),
  },
  {
    path: 'direct-donation-inventories',
    loadChildren: () =>
      import(
        './proposal-inventories-donation/direct-donation-proposal/fdp-pidw-m-web-donation-inventory.module'
      ).then(m => m.FdpPidwMWebDonationInventoryModule),
  },
  {
    path: 'maintenance-commitment-donation',
    loadChildren: () =>
      import(
        './maintenance-commitment-donation/fdp-mcpd-m-maintenance-commitment-donation.module'
      ).then(m => m.FdpMcpdMMaintenanceCommitmentDonationModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationProcessRoutingModule {}
