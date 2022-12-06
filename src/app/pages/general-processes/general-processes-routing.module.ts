import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'notifications-association',
    loadChildren: async () =>
      (
        await import(
          './notification-association/notification-association.module'
        )
      ).NotificationAssociationModule,
  },
  {
    path: 'goods-characteristics',
    loadChildren: async () =>
      (await import('./goods-characteristics/goods-characteristics.module'))
        .GoodsCharacteristicsModule,
  },
  {
    path: 'historical-good-situation',
    loadChildren: async () =>
      (
        await import(
          './historical-good-situation/historical-good-situation.module'
        )
      ).HistoricalGoodSituationModule,
  },
  {
    path: 'purging-records',
    loadChildren: async () =>
      (await import('./purging-records/purging-records.module'))
        .PurgingRecordsModule,
  },
  {
    path: 'goods-tracker',
    loadChildren: async () =>
      (await import('./goods-tracker/goods-tracker.module')).GoodsTrackerModule,
  },
  {
    path: 'records-tracker',
    loadChildren: async () =>
      (await import('./records-tracker/records-tracker.module'))
        .RecordsTrackerModule,
  },
  {
    path: 'scan-request',
    loadChildren: async () =>
      (await import('./scan-request/scan-request.module')).ScanRequestModule,
  },
  {
    path: 'documents-viewer',
    loadChildren: async () =>
      (await import('./documents-viewer/documents-viewer.module'))
        .DocumentsViewerModule,
  },
  {
    path: 'indicators',
    loadChildren: async () =>
      (await import('./indicators/indicators.module')).IndicatorsModule,
  },
  {
    path: 'bulk-technical-sheets-generation',
    loadChildren: async () =>
      (
        await import(
          './bulk-technical-sheets-generation/bulk-technical-sheets-generation.module'
        )
      ).BulkTechnicalSheetsGenerationModule,
  },
  {
    path: 'image-debugging',
    loadChildren: async () =>
      (await import('./image-debugging/image-debugging.module'))
        .ImageDebuggingModule,
  },
  {
    path: 'status-change',
    loadChildren: async () =>
      (await import('./status-change/status-change.module')).StatusChangeModule,
  },
  {
    path: 'mass-goods-deletion',
    loadChildren: async () =>
      (await import('./mass-goods-deletion/mass-goods-deletion.module'))
        .MassGoodsDeletionModule,
  },
  {
    path: 'goods-partialization',
    loadChildren: async () =>
      (await import('./goods-partialization/goods-partialization.module'))
        .GoodsPartializationModule,
  },
  {
    path: 'goods-with-required-information',
    loadChildren: async () =>
      (
        await import(
          './goods-with-required-info/goods-with-required-info.module'
        )
      ).GoodsWithRequiredInfoModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralProcessesRoutingModule {}
