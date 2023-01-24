import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'capture-and-digitalization',
    data: { screen: 'FINDICA_0001', title: 'Captura y Digitalización' },
    loadChildren: async () =>
      (await import('./capture-digitalization/capture-digitalization.module'))
        .CaptureDigitalizationModule,
  },
  {
    path: 'opinion',
    data: { screen: 'FINDICA_0002', title: 'Dictaminación' },
    loadChildren: async () =>
      (await import('./opinion/opinion.module')).OpinionModule,
  },
  {
    path: 'reception-and-delivery',
    data: { screen: 'FINDICA_0035_2', title: 'Recepción - Entrega' },
    loadChildren: async () =>
      (await import('./reception-and-delivery/reception-and-delivery.module'))
        .ReceptionAndDeliveryModule,
  },
  {
    path: 'technical-datasheet', // ! No se migra
    data: { screen: '', title: '' },
    loadChildren: async () =>
      (await import('./technical-datasheet/technical-datasheet.module'))
        .TechnicalDatasheetModule,
  },
  {
    path: 'account-status',
    data: { screen: 'FINDICA_0006', title: 'Reporte de Estados de Cuenta' },
    loadChildren: async () =>
      (await import('./account-status/account-status.module'))
        .AccountStatusModule,
  },
  {
    path: 'management-strategies',
    data: { screen: 'FINDICA_0007', title: 'Estrategias de Administración' },
    loadChildren: async () =>
      (await import('./management-strategies/management-strategies.module'))
        .ManagementStrategiesModule,
  },
  {
    path: 'reception-strategies',
    data: { screen: 'FINDICA_0035_3', title: 'Estrategias de Recepción' },
    loadChildren: async () =>
      (await import('./reception-strategies/reception-strategies.module'))
        .ReceptionStrategiesModule,
  },
  {
    path: 'consolidated',
    data: { screen: 'FINDICA_0008', title: 'Consolidado' },
    loadChildren: async () =>
      (await import('./consolidated/consolidated.module')).ConsolidatedModule,
  },
  {
    path: 'incident-maintenance',
    data: { screen: 'FMNTO_INCIDENTES', title: 'Mantenimiento a Incidentes' },
    loadChildren: async () =>
      (await import('./incident-maintenance/incident-maintenance.module'))
        .IncidentMaintenanceModule,
  },
  {
    path: 'history',
    data: { screen: 'HISTINDICADORES', title: 'Histórico de Indicadores' },
    loadChildren: async () =>
      (await import('./indicators-history/indicators-history.module'))
        .IndicatorsHistoryModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsRoutingModule {}
