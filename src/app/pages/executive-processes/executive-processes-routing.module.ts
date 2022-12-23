import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'quarterly-accumulated-assets',
    loadChildren: async () =>
      (
        await import(
          './quarterly-accumulated-assets/quarterly-accumulated-assets.module'
        )
      ).QuarterlyAccumulatedAssetsModule,
    data: {
      title: 'Acumulado Trimestral de Bienes',
      screen: 'FGERDIRBIACUMTRIM',
    },
  },
  {
    path: 'annual-accumulated-assets',
    loadChildren: async () =>
      (
        await import(
          './annual-accumulated-assets/annual-accumulated-assets.module'
        )
      ).AnnualAccumulatedAssetsModule,
    data: { title: 'Acumulado Anual de Bienes', screen: 'FGERDIRBIACUMANUA' },
  },
  {
    path: 'acumulative-asset-tabs',
    loadChildren: async () =>
      (await import('./acumulative-asset-tabs/acumulative-asset-tabs.module'))
        .AcumulativeAssetTabsModule,
    data: { title: 'Acumulado de Bienes' },
  },
  {
    path: 'cumulative-goods',
    loadChildren: async () =>
      (await import('./cumulative-goods/cumulative-goods.module'))
        .CumulativeGoodsModule,
    data: {
      title: 'Control Mensual de Recepción Documental',
      screen: 'FGERDIRCTRLXMES',
    },
  },
  {
    path: 'report-registration-module',
    loadChildren: async () =>
      (
        await import(
          './report-registration-module/report-registration-module.module'
        )
      ).ReportRegistrationModuleModule,
    data: {
      title: 'Información Bienes Asegurados/Decomisos/Abandonos',
      screen: 'FGERDIRREGISTROBI',
    },
  },
  {
    path: 'doc-received-authority',
    loadChildren: async () =>
      (await import('./doc-received-authority/doc-received-authority.module'))
        .DocReceivedAuthorityModule,
    data: {
      title: 'Recepción de Doctos. Por Autoridad Emisora',
      screen: 'FCONDIRRECEPAUTEM',
    },
  },
  {
    path: 'daily-control-reception',
    loadChildren: async () =>
      (await import('./daily-control-reception/daily-control-reception.module'))
        .DailyControlReceptionModule,
    data: {
      title: 'Recepción Diaria de Expedientes',
      screen: 'FGERDIRCTRLDIARIO',
    },
  },
  {
    path: 'destruction-authorization-management',
    loadChildren: async () =>
      (
        await import(
          './destruction-authorization-management/destruction-authorization-management.module'
        )
      ).DestructionAuthorizationManagementModule,
    data: {
      title: 'Gestión de Autorización de Destrucción',
      screen: 'FESTATUSRGA',
    },
  },
  {
    path: 'authorization-assets-destruction',
    loadChildren: async () =>
      (
        await import(
          './authorization-assets-destruction/authorization-assets-destruction.module'
        )
      ).AuthorizationAssetsDestructionModule,
    data: { title: 'Aprobación destrucción', screen: 'FACTDIRAPROBDESTR' },
  },
  {
    path: 'approval-assets-destination',
    loadChildren: async () =>
      (
        await import(
          './approval-assets-destination/approval-assets-destination.module'
        )
      ).ApprovalAssetsDestinationModule,
    data: { title: 'Aprobación destino', screen: 'FACTDESAPROBUTILI' },
  },
  {
    path: 'reception-area-sera',
    loadChildren: async () =>
      (await import('./reception-area-sera/reception-area-sera.module'))
        .ReceptionAreaSeraModule,
    data: {
      title: 'Recepción de Doctos. x Destino en el SERA',
      screen: 'FCONDIRRECEPDOCTOA',
    },
  },
  {
    path: 'totaldoc-received-destinationarea',
    loadChildren: async () =>
      (
        await import(
          './totaldoc-received-destinationarea/totaldoc-received-destinationarea.module'
        )
      ).TotaldocReceivedDestinationareaModule,
    data: {
      title: 'Documentación recibida X Área Destino',
      screen: 'FCONDIRREPORECDOCA',
    },
  },
  {
    path: 'report-doc-received',
    loadChildren: async () =>
      (await import('./report-doc-received/report-doc-received.module'))
        .ReportDocReceivedModule,
    data: {
      title: 'Total de Documentación Recibida',
      screen: 'FCONDIRREPORECDOC',
    },
  },
  {
    path: 'assets-received-admon',
    loadChildren: async () =>
      (await import('./assets-received-admon/assets-received-admon.module'))
        .AssetsReceivedAdmonModule,
    data: {
      title: 'Bienes recibidos en Administración',
      screen: 'FCONDIRREPORBIERE',
    },
  },
  {
    path: 'update-mss-value',
    loadChildren: async () =>
      (await import('./update-mss-value/update-mss-value.module'))
        .UpdateMssValueModule,
    data: {
      title: 'Actualización masiva de Valor de Avalúo',
      screen: 'FMASUPDAVALUOS',
    },
  },
  {
    path: 'donation-approval',
    loadChildren: async () =>
      (await import('./donation-approval/donation-approval.module'))
        .DonationApprovalModule,
    data: { title: 'Aprobación donación', screen: 'FACTDESAPROBDONAC' },
  },
  {
    path: 'approval-change-numeraire',
    loadChildren: async () =>
      (
        await import(
          './approval-change-numeraire/approval-change-numeraire.module'
        )
      ).ApprovalChangeNumeraireModule,
    data: {
      title: ' Aprobación de cambio a numerario',
      screen: 'FACTDIRAPROBCAMNU',
    },
  },
  {
    path: 'doc-received-sera',
    loadChildren: async () =>
      (await import('./doc-received-sera/doc-received-sera.module'))
        .DocReceivedSeraModule,
    data: {
      title: 'Documentación recibida en sera',
      screen: 'FCONDIRRECEPDOCTO',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutiveProcessesRoutingModule {}
