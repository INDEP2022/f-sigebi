import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pe-atb-m-quarterly-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-atb-m-quarterly-accumulated-assets/pe-atb-m-quarterly-accumulated-assets.module')).PeAtbMQuarterlyAccumulatedAssetsModule,
    data: { title: 'Acumulado Trimestral de Bienes' },
  },
  {
    path: 'pe-aab-m-annual-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-aab-m-annual-accumulated-assets/pe-aab-m-annual-accumulated-assets.module')).PeAabMAnnualAccumulatedAssetsModule,
    data: { title: 'Acumulado Anual de Bienes' },
  },
  {
    path: 'acumulative-asset-tabs',
    loadChildren: async () =>
      (await import('./acumulative-asset-tabs/acumulative-asset-tabs.module')).AcumulativeAssetTabsModule,
    data: { title: 'Acumulado de Bienes' },
  },
  {
    path: 'pe-cmrd-m-cumulative-goods',
    loadChildren: async () =>
      (await import('./pe-cmrd-m-cumulative-goods/pe-cmrd-m-cumulative-goods.module')).PeCmrdMCumulativeGoodsModule,
    data: { title: 'Control Mensual de Recepción Documental' },
  },
  {
    path: 'pe-ibs-d-a-m-report-registration-module',
    loadChildren: async () =>
      (await import('./pe-ibs-d-a-m-report-registration-module/pe-ibs-d-a-m-report-registration-module.module')).PeIbsDAMReportRegistrationModuleModule,
    data: { title: 'Información Bienes' },
  },
  {
    path: 'pe-drpae-m-doc-received-authority',
    loadChildren: async () =>
      (await import('./pe-drpae-m-doc-received-authority/pe-drpae-m-doc-received-authority.module')).PeDrpaeMDocReceivedAuthorityModule,
    data: { title: 'Reporte de documentación recibida por autoridad emisora' },
  },
  {
    path: 'pe-rdde-m-daily-control-reception',
    loadChildren: async () =>
      (await import('./pe-rdde-m-daily-control-reception/pe-rdde-m-daily-control-reception.module')).PeRddeMDailyControlReceptionModule,
    data: { title: 'Control diario de recepción de expedientes' },
  },
  {
    path: 'pe-gdadd-m-destruction-authorization-management',
    loadChildren: async () =>
      (await import('./pe-gdadd-m-destruction-authorization-management/pe-gdadd-m-destruction-authorization-management.module')).PeGdaddMDestructionAuthorizationManagementModule,
    data: { title: 'Gestión de Autorización de Destrucción' },
  },
  {
    path: 'pe-ad-m-authorization-assets-destruction',
    loadChildren: async () =>
      (await import('./pe-ad-m-authorization-assets-destruction/pe-ad-m-authorization-assets-destruction.module')).PeAdMAuthorizationAssetsDestructionModule,
    data: { title: 'Autorización de bienes para destrucción ' },
  },
  {
    path: 'pe-ad-m-approval-assets-destination',
    loadChildren: async () =>
      (await import('./pe-ad-m-approval-assets-destination/pe-ad-m-approval-assets-destination.module')).PeAdMApprovalAssetsDestinationModule,
    data: { title: 'Aprobación de bienes para destino' },
  },
  {
    path: 'pe-rddxdees-m-reception-area-sera',
    loadChildren: async () =>
      (await import('./pe-rddxdees-m-reception-area-sera/pe-rddxdees-m-reception-area-sera.module')).PeRddxdeesMReceptionAreaSeraModule,
    data: { title: 'Recepción recibida por área en el SERA ' },
  },
  {
    path: 'pe-rddg-drpad-m-totaldoc-received-destinationarea',
    loadChildren: async () =>
      (await import('./pe-rddg-drpad-m-totaldoc-received-destinationarea/pe-rddg-drpad-m-totaldoc-received-destinationarea.module')).PeRddgDrpadMTotaldocReceivedDestinationareaModule,
    data: { title: 'Total de documentos recibidos vs área destino ' },
  },
  {
    path: 'pe-rddg-tddr-m-report-doc-received',
    loadChildren: async () =>
      (await import('./pe-rddg-tddr-m-report-doc-received/pe-rddg-tddr-m-report-doc-received.module')).PeRddgTddrMReportDocReceivedModule,
    data: { title: 'Reporte Documentación Recibida' },
  },
  {
    path: 'pe-rddg-brea-m-assets-received-admon',
    loadChildren: async () =>
      (await import('./pe-rddg-brea-m-assets-received-admon/pe-rddg-brea-m-assets-received-admon.module')).PeRddgBreaMAssetsReceivedAdmonModule,
    data: { title: 'Reporte de bienes recibidos en administración ' },
  },
  {
    path: 'pe-amdvda-m-update-mss-value',
    loadChildren: async () =>
      (await import('./pe-amdvda-m-update-mss-value/pe-amdvda-m-update-mss-value.module')).PeAmdvdaMUpdateMssValueModule,
    data: { title: 'Proceso de actualización masiva de valor avaluó' },
  },
  {
    path: 'pe-ad-m-donation-approval',
    loadChildren: async () =>
      (await import('./pe-ad-m-donation-approval/pe-ad-m-donation-approval.module')).PeAdMDonationApprovalModule,
    data: { title: 'Aprobación donación' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveProcessesRoutingModule { }
