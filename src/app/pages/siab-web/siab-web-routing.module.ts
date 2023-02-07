import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'commercialization',
    loadChildren: async () =>
      (await import('./commercialization/commercialization.module'))
        .CommercializationModule,
  },
  {
    path: 'sami',
    loadChildren: async () => (await import('./sami/sami.module')).SamiModule,
  },
  {
    path: 'appraisals',
    loadChildren: async () =>
      (await import('./appraisals/appraisals.module')).AppraisalsModule,
  },
  {
    path: 'tracker',
    loadChildren: async () =>
      (await import('./tools/tracker/tracker.module')).TrackerModule,
  },
  {
    path: 'goods-view-finder',
    loadChildren: async () =>
      (await import('./tools/goods-view-finder/goods-view-finder.module'))
        .GoodsViewFinderModule,
  },
  {
    path: 'load-of-locators',
    loadChildren: async () =>
      (await import('./tools/load-of-locators/load-of-locators.module'))
        .LoadOfLocatorsModule,
  },
  {
    path: 'query-interconnection',
    loadChildren: async () =>
      (
        await import(
          './tools/query-interconnection/query-interconnection.module'
        )
      ).QueryInterconnectionModule,
  },
  {
    path: 'indicators',
    loadChildren: async () =>
      (await import('./indicators/indicators.module')).IndicatorsModule,
  },
  {
    path: 'parametrization',
    loadChildren: async () =>
      (await import('./parametrization/parametrization.module'))
        .ParametrizationModule,
  },
  {
    path: 'consultation',
    loadChildren: async () =>
      (await import('./consultation/consultation.module')).ConsultationModule,
  },
  {
    path: 'claims-control',
    loadChildren: async () =>
      (await import('./claims-control/claims-control.module'))
        .ClaimsControlModule,
  },
  {
    path: 'maintenance',
    loadChildren: async () =>
      (await import('./maintenance/maintenance.module')).MaintenanceModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiabWebRoutingModule {}
