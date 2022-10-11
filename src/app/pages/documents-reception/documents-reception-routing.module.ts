import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'flyers-registration',
    children: [
      {
        path: '',
        loadChildren: async () =>
          (await import('./dr-flyers/dr-flyers.module')).DrFlyersModule,
      },
    ],
  },
  {
    path: 'goods-capture',
    loadChildren: async () =>
      (await import('./dr-goods/dr-goods.module')).DrGoodsModule,
  },
  {
    path: 'shipping-documents',
    loadChildren: async () =>
      (await import('./dr-shipping-documents/dr-shipping-documents.module'))
        .DrShippingDocumentsModule,
  },
  {
    path: 'print-flyers',
    loadChildren: async () =>
      (await import('./dr-print-flyers/dr-print-flyers.module'))
        .DrPrintFlyersModule,
  },
  {
    path: 'report',
    loadChildren: async () =>
      (await import('./dr-report/dr-report.module')).DrReportModule,
  },
  {
    path: 'summary',
    loadChildren: async () =>
      (await import('./dr-summary/dr-summary.module')).DrSummaryModule,
  },
  {
    path: 'notifications-flat-file',
    loadChildren: async () =>
      (
        await import(
          './dr-flat-file-notifications/dr-flat-file-notifications.module'
        )
      ).DrFlatFileNotificationsModule,
  },
  {
    path: 'goods-bulk-load',
    loadChildren: async () =>
      (await import('./dr-goods-bulk-load/dr-goods-bulk-load.module'))
        .DrGoodsBulkLoadModule,
  },
  {
    path: 'sat-sae-goods-load',
    loadChildren: async () =>
      (await import('./dr-sat-sae-goods-load/dr-sat-sae-goods-load.module'))
        .DrSatSaeGoodsLoadModule,
  },
  {
    path: 'sat-subjects-register',
    loadChildren: async () =>
      (
        await import(
          './dr-sat-subjects-register/dr-sat-subjects-register.module'
        )
      ).DrSatSubjectsRegisterModule,
  },
  {
    path: 'pgr-subjects-register',
    loadChildren: async () =>
      (
        await import(
          './dr-pgr-subjects-register/dr-pgr-subjects-register.module'
        )
      ).DrPgrSubjectsRegisterModule,
  },
  {
    path: 'documents-requirements-verification',
    loadChildren: async () =>
      (
        await import(
          './dr-documents-requirements-verification/dr-documents-requirements-verification.module'
        )
      ).DrDocumentsRequirementsVerificationModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsReceptionRoutingModule {}
