import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auction-report',
    loadChildren: async () =>
      (await import('./auction-report/auction-report.module'))
        .auctionReportModule,
    data: { title: 'Reporte Subasta' },
  },
  {
    path: 'management-capture-lines',
    loadChildren: async () =>
      (
        await import(
          './management-capture-lines/management-capture-lines.module'
        )
      ).managementCaptureLinesModule,
    data: { title: 'Lineas de captura' },
  },
  {
    path: 'winners-report',
    loadChildren: async () =>
      (await import('./winners-report/winners-report.module'))
        .winnersReportModule,
    data: { title: 'Reporte de ganadores' },
  },
  {
    path: 'valid-capture-line',
    loadChildren: async () =>
      (await import('./valid-capture-line/valid-capture-line.module'))
        .validCaptureLineModule,
    data: { title: 'Valida línea captura' },
  },
  {
    path: 'report-oi',
    loadChildren: async () =>
      (await import('./report-oi/report-oi.module')).reportOiModule,
    data: { title: 'Reporte OI' },
  },
  {
    path: 'billing-payments',
    loadChildren: async () =>
      (await import('./billing-payments/billing-payments.module'))
        .billingPaymentsModule,
    data: { title: 'Pagos facturación' },
  },
  {
    path: 'proof-delivery',
    loadChildren: async () =>
      (await import('./proof-delivery/proof-delivery.module'))
        .proofDeliveryModule,
    data: { title: 'Constancia de entrega' },
  },
  {
    path: 'report-invoices',
    loadChildren: async () =>
      (await import('./report-invoices/report-invoices.module'))
        .reportInvoicesModule,
    data: { title: 'Reporte de facturas' },
  },
  {
    path: 'report-batches-pending',
    loadChildren: async () =>
      (await import('./report-batches-pending/report-batches-pending.module'))
        .reportBatchesPendingModule,
    data: { title: 'Reporte de lotes pendientes de liquidar' },
  },
  {
    path: 'monitoring-cps-sps',
    loadChildren: async () =>
      (await import('./monitoring-cps-sps/monitoring-cps-sps.module'))
        .monitoringCpsSpsModule,
    data: { title: 'Monitoreo de cps y sps' },
  },
  {
    path: 'appraisal-charge',
    loadChildren: async () =>
      (await import('./appraisal-charge/appraisal-charge.module'))
        .appraisalChargeModule,
    data: { title: 'Carga de Avalúos' },
  },
  {
    path: 'monitoring-cps-sps-tabs',
    loadChildren: async () =>
      (await import('./monitoring-cps-sps-tabs/monitoring-cps-sps-tabs.module'))
        .MonitoringCpsSpsTabsModule,
    data: { title: 'Monitoreo de cps y sps' },
  },
  {
    path: 'batch-status-monitoring',
    loadChildren: async () =>
      (await import('./batch-status-monitoring/batch-status-monitoring.module'))
        .BatchStatusMonitoringModule,
    data: { title: 'Monitoreo estatus lotes' },
  },
  {
    path: 'report-exposure-for-sale',
    loadChildren: async () =>
      (
        await import(
          './report-exposure-for-sale/report-exposure-for-sale.module'
        )
      ).ReportExposureForSaleModule,
    data: { title: 'Reporte exposición a venta' },
  },
  {
    path: 'report-sales-attempts',
    loadChildren: async () =>
      (await import('./report-sales-attempts/report-sales-attempts.module'))
        .ReportSalesAttemptsModule,
    data: { title: 'Reporte intentos de venta' },
  },
  {
    path: 'report-unsold-goods',
    loadChildren: async () =>
      (await import('./report-unsold-goods/report-unsold-goods.module'))
        .ReportUnsoldGoodsModule,
    data: { title: 'Reporte bienes sin vender' },
  },
  {
    path: 'payload',
    loadChildren: async () =>
      (await import('./payload/payload.module')).PayloadModule,
    data: { title: 'Carga de pagos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
