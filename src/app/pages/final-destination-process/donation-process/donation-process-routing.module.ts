import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'export-goods-donation',
    loadChildren: () =>
      import('./export-goods-donation/export-goods-donation.module').then(
        m => m.ExportGoodsDonationModule
      ),
  },
  {
    path: 'web-donation-inventories',
    loadChildren: () =>
      import(
        './proposal-inventories-donation/website-donation-proposal/direct-donation-inventory.module'
      ).then(m => m.DirectDonationInventoryModule),
  },
  {
    path: 'direct-donation-inventories',
    loadChildren: () =>
      import(
        './proposal-inventories-donation/direct-donation-proposal/web-donation-inventory.module'
      ).then(m => m.WebDonationInventoryModule),
  },
  {
    path: 'maintenance-commitment-donation',
    loadChildren: () =>
      import(
        './maintenance-commitment-donation/maintenance-commitment-donation.module'
      ).then(m => m.MaintenanceCommitmentDonationModule),
  },
  {
    path: 'approval-for-donation',
    loadChildren: () =>
      import('./approval-for-donation/approval-for-donation.module').then(
        m => m.ApprovalForDonationModule
      ),
  },
  {
    path: 'donation-authorization-request',
    loadChildren: () =>
      import(
        './donation-authorization-request/donation-authorization-request.module'
      ).then(m => m.DonationAuthorizationRequestModule),
  },
  {
    path: 'partialization-goods-donation',
    loadChildren: () =>
      import(
        './partialization-goods-donation/partialization-goods-donation.module'
      ).then(m => m.PartializationGoodsDonationModule),
  },
  {
    path: 'registration-inventories-donation',
    loadChildren: () =>
      import(
        './registration-inventories-donation/registration-inventories-donation.module'
      ).then(m => m.RegistrationInventoriesDonationModule),
  },
  {
    path: 'donation-contracts',
    loadChildren: () =>
      import('./donation-contracts/donation-contracts.module').then(
        m => m.DonationContractsModule
      ),
  },
  {
    path: 'administrator-donation-contract',
    loadChildren: () =>
      import(
        './administrator-donation-contract/administrator-donation-contract.module'
      ).then(m => m.AdministratorDonationContractModule),
  },
  {
    path: 'donation-processes',
    loadChildren: () =>
      import('./donation-processes/donation-processes.module').then(
        m => m.DonationProcessesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationProcessRoutingModule {}
