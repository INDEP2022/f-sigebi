import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'capture-and-digitalization',
    loadChildren: async () =>
      (await import('./capture-digitalization/capture-digitalization.module'))
        .CaptureDigitalizationModule,
  },
  {
    path: 'opinion',
    loadChildren: async () =>
      (await import('./opinion/opinion.module')).OpinionModule,
  },
  {
    path: 'reception-and-delivery',
    loadChildren: async () =>
      (await import('./reception-and-delivery/reception-and-delivery.module'))
        .ReceptionAndDeliveryModule,
  },
  {
    path: 'technical-datasheet',
    loadChildren: async () =>
      (await import('./technical-datasheet/technical-datasheet.module'))
        .TechnicalDatasheetModule,
  },
  {
    path: 'account-status',
    loadChildren: async () =>
      (await import('./account-status/account-status.module'))
        .AccountStatusModule,
  },
  {
    path: 'management-strategies',
    loadChildren: async () =>
      (await import('./management-strategies/management-strategies.module'))
        .ManagementStrategiesModule,
  },
  {
    path: 'reception-strategies',
    loadChildren: async () =>
      (await import('./reception-strategies/reception-strategies.module'))
        .ReceptionStrategiesModule,
  },
  {
    path: 'consolidated',
    loadChildren: async () =>
      (await import('./consolidated/consolidated.module')).ConsolidatedModule,
  },
  {
    path: 'incident-maintenance',
    loadChildren: async () =>
      (await import('./incident-maintenance/incident-maintenance.module'))
        .IncidentMaintenanceModule,
  },
  {
    path: 'history',
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
