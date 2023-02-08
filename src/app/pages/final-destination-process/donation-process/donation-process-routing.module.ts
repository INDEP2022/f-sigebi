import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'export-goods-donation',
    loadChildren: () =>
      import('./export-goods-donation/export-goods-donation.module').then(
        m => m.ExportGoodsDonationModule
      ),
    data: {
      title: 'Exportación de Bienes para Donación',
      screen: 'FDONACIONES',
    },
  },
  {
    path: 'web-donation-inventories',
    loadChildren: () =>
      import(
        './proposal-inventories-donation/website-donation-proposal/direct-donation-inventory.module'
      ).then(m => m.DirectDonationInventoryModule),
    data: {
      title: 'Propuesta de Inventarios para Donación Web',
      screen: 'FDONPROPCONTRATOW',
    },
  },
  {
    path: 'direct-donation-inventories',
    loadChildren: () =>
      import(
        './proposal-inventories-donation/direct-donation-proposal/web-donation-inventory.module'
      ).then(m => m.WebDonationInventoryModule),
    data: {
      title: 'Propuesta de Inventarios para Donación Web',
      screen: 'FDONPROPCONTRATO',
    },
  },
  {
    path: 'maintenance-commitment-donation',
    loadChildren: () =>
      import(
        './maintenance-commitment-donation/maintenance-commitment-donation.module'
      ).then(m => m.MaintenanceCommitmentDonationModule),
    data: {
      title: 'Mantenimiento Comprometer para Donación',
      screen: 'FMCOMDONAC_R',
    },
  },
  {
    path: 'approval-for-donation',
    loadChildren: () =>
      import('./approval-for-donation/approval-for-donation.module').then(
        m => m.ApprovalForDonationModule
      ),
    data: {
      title: 'Aprobación Para Donación',
      screen: 'FMCOMDONAC',
    },
  },
  {
    path: 'donation-authorization-request',
    loadChildren: () =>
      import(
        './donation-authorization-request/donation-authorization-request.module'
      ).then(m => m.DonationAuthorizationRequestModule),
    data: {
      title: 'Solicitud y Autorización de Donaciones',
      screen: 'FDONSOLAUTORIZA',
    },
  },
  {
    path: 'partialization-goods-donation',
    loadChildren: () =>
      import(
        './partialization-goods-donation/partialization-goods-donation.module'
      ).then(m => m.PartializationGoodsDonationModule),
    data: {
      title: 'Parcialización Bienes en Donación',
      screen: 'FACTGENPARCDON',
    },
  },
  {
    path: 'registration-inventories-donation',
    loadChildren: () =>
      import(
        './registration-inventories-donation/registration-inventories-donation.module'
      ).then(m => m.RegistrationInventoriesDonationModule),
    data: {
      title: 'Registro para Inventarios y Donación Directa',
      screen: 'FDONAC_DIRECT',
    },
  },
  {
    path: 'donation-contracts',
    loadChildren: () =>
      import('./donation-contracts/donation-contracts.module').then(
        m => m.DonationContractsModule
      ),
    data: {
      title: 'Contratos de Donación',
      screen: 'FDONAC_DOCUM',
    },
  },
  {
    path: 'administrator-donation-contract',
    loadChildren: () =>
      import(
        './administrator-donation-contract/administrator-donation-contract.module'
      ).then(m => m.AdministratorDonationContractModule),
    data: {
      title: 'Contratos de Donación Directa Administrador',
      screen: 'FDONAC_DOCUM_ADM',
    },
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
