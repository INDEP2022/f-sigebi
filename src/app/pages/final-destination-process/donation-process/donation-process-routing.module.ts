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
  {
    path: 'approval-for-donation',
    loadChildren: () =>
      import(
        './approval-for-donation/fdp-apd-m-approval-for-donation.module'
      ).then(m => m.FdpApdMApprovalForDonationModule),
  },
  {
    path: 'donation-authorization-request',
    loadChildren: () =>
      import(
        './donation-authorization-request/fdp-sad-m-donation-authorization-request.module'
      ).then(m => m.FdpSadMDonationAuthorizationRequestModule),
  },
  {
    path: 'partialization-goods-donation',
    loadChildren: () =>
      import(
        './partialization-goods-donation/fdp-pbd-m-partialization-goods-donation.module'
      ).then(m => m.FdpPbdMPartializationGoodsDonationModule),
  },
  {
    path: 'registration-inventories-donation',
    loadChildren: () =>
      import(
        './registration-inventories-donation/fdp-ridd-m-registration-inventories-donation.module'
      ).then(m => m.FdpRiddMRegistrationInventoriesDonationModule),
  },
  {
    path: 'donation-contracts',
    loadChildren: () =>
      import('./donation-contracts/fdp-cdd-m-donation-contracts.module').then(
        m => m.FdpCddMDonationContractsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationProcessRoutingModule {}
