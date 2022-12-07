import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'flyers-registration',
    children: [
      {
        path: '',
        loadChildren: async () =>
          (await import('./flyers/flyers.module')).FlyersModule,
      },
    ],
  },
  {
    path: 'goods-capture',
    loadChildren: async () =>
      (await import('./goods/goods.module')).GoodsModule,
  },
  {
    path: 'shipping-documents',
    loadChildren: async () =>
      (await import('./shipping-documents/shipping-documents.module'))
        .ShippingDocumentsModule,
  },
  {
    path: 'print-flyers',
    loadChildren: async () =>
      (await import('./print-flyers/print-flyers.module')).PrintFlyersModule,
  },
  {
    path: 'report',
    loadChildren: async () =>
      (await import('./report/report.module')).ReportModule,
  },
  {
    path: 'summary',
    loadChildren: async () =>
      (await import('./summary/summary.module')).SummaryModule,
  },
  {
    path: 'notifications-flat-file',
    loadChildren: async () =>
      (await import('./flat-file-notifications/flat-file-notifications.module'))
        .FlatFileNotificationsModule,
  },
  {
    path: 'goods-bulk-load',
    loadChildren: async () =>
      (await import('./goods-bulk-load/goods-bulk-load.module'))
        .GoodsBulkLoadModule,
  },
  {
    path: 'sat-sae-goods-load',
    loadChildren: async () =>
      (await import('./sat-sae-goods-load/sat-sae-goods-load.module'))
        .SatSaeGoodsLoadModule,
  },
  {
    path: 'sat-subjects-register',
    loadChildren: async () =>
      (await import('./sat-subjects-register/sat-subjects-register.module'))
        .SatSubjectsRegisterModule,
  },
  {
    path: 'subjects-register',
    loadChildren: async () =>
      (await import('./subjects-register/subjects-register.module'))
        .SubjectsRegisterModule,
  },
  {
    path: 'documents-requirements-verification',
    loadChildren: async () =>
      (
        await import(
          './documents-requirements-verification/documents-requirements-verification.module'
        )
      ).DocumentsRequirementsVerificationModule,
  },
  {
    path: 'closing-of-confiscation-and-return-records',
    loadChildren: async () =>
      (
        await import(
          './closing-confiscation-and-return-records/closing-confiscation-and-return-records.module'
        )
      ).ClosingConfiscationAndReturnRecordsModule,
  },
  {
    path: 'records-inventory',
    loadChildren: async () =>
      (await import('./records-inventory/records-inventory.module'))
        .RecordsInventoryModule,
  },
  {
    path: 'goods-forecast',
    loadChildren: async () =>
      (await import('./goods-forecast/goods-forecast.module'))
        .GoodsForecastModule,
  },
  {
    path: 'records-validation',
    loadChildren: async () =>
      (await import('./records-validation/records-validation.module'))
        .RecordsValidationModule,
  },
  {
    path: 'goods-vigilance-service',
    loadChildren: async () =>
      (await import('./goods-vigilance-service/goods-vigilance-service.module'))
        .GoodsVigilanceServiceModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsReceptionRoutingModule {}
