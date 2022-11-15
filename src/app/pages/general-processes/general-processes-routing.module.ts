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
  {
    path: 'bulk-technical-sheets-generation',
    loadChildren: async () =>
      (
        await import(
          './gp-bulk-technical-sheets-generation/gp-bulk-technical-sheets-generation.module'
        )
      ).GpBulkTechnicalSheetsGenerationModule,
  },
  {
    path: 'image-debugging',
    loadChildren: async () =>
      (await import('./gp-image-debugging/gp-image-debugging.module'))
        .GpImageDebuggingModule,
  },
  {
    path: 'status-change',
    loadChildren: async () =>
      (await import('./gp-status-change/gp-status-change.module'))
        .GpStatusChangeModule,
  },
  {
    path: 'mass-goods-deletion',
    loadChildren: async () =>
      (await import('./gp-mass-goods-deletion/gp-mass-goods-deletion.module'))
        .GpMassGoodsDeletionModule,
  },
  {
    path: 'goods-partialization',
    loadChildren: async () =>
      (await import('./gp-goods-partialization/gp-goods-partialization.module'))
        .GpGoodsPartializationModule,
  },
  {
    path: 'goods-with-required-information',
    loadChildren: async () =>
      (
        await import(
          './gp-goods-with-required-info/gp-goods-with-required-info.module'
        )
      ).GpGoodsWithRequiredInfoModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralProcessesRoutingModule {}
