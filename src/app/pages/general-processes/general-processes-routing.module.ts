import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'notifications-association',
    loadChildren: async () =>
      (
        await import(
          './gp-notification-association/gp-notification-association.module'
        )
      ).GpNotificationAssociationModule,
  },
  {
    path: 'goods-characteristics',
    loadChildren: async () =>
      (
        await import(
          './gp-goods-characteristics/gp-goods-characteristics.module'
        )
      ).GpGoodsCharacteristicsModule,
  },
  {
    path: 'historical-good-situation',
    loadChildren: async () =>
      (
        await import(
          './gp-historical-good-situation/gp-historical-good-situation.module'
        )
      ).GpHistoricalGoodSituationModule,
  },
  {
    path: 'purging-records',
    loadChildren: async () =>
      (await import('./gp-purging-records/gp-purging-records.module'))
        .GpPurgingRecordsModule,
  },
  {
    path: 'goods-tracker',
    loadChildren: async () =>
      (await import('./gp-goods-tracker/gp-goods-tracker.module'))
        .GpGoodsTrackerModule,
  },
  {
    path: 'records-tracker',
    loadChildren: async () =>
      (await import('./gp-records-tracker/gp-records-tracker.module'))
        .GpRecordsTrackerModule,
  },
  {
    path: 'scan-request',
    loadChildren: async () =>
      (await import('./gp-scan-request/gp-scan-request.module'))
        .GpScanRequestModule,
  },
  {
    path: 'documents-viewer',
    loadChildren: async () =>
      (await import('./gp-documents-viewer/gp-documents-viewer.module'))
        .GpDocumentsViewerModule,
  },
  {
    path: 'indicators',
    loadChildren: async () =>
      (await import('./gp-indicators/gp-indicators.module')).GpIndicatorsModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralProcessesRoutingModule {}
