import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auction-report',
    loadChildren: async () =>
      (await import('./auction-report/auction-report.module'))
        .auctionReportModule,
    data: { title: 'Reporte Subasta', screen: 'ReporteSubastas' },
  },
  {
    path: 'management-capture-lines',
    loadChildren: async () =>
      (
        await import(
          './management-capture-lines/management-capture-lines.module'
        )
      ).managementCaptureLinesModule,
    data: { title: 'Lineas de captura', screen: 'AdmLineasCaptura' },
  },
  {
    path: 'winners-report',
    loadChildren: async () =>
      (await import('./winners-report/winners-report.module'))
        .winnersReportModule,
    data: { title: 'Reporte de ganadores', screen: 'ReporteGanadores' },
  },
  {
    path: 'valid-capture-line',
    loadChildren: async () =>
      (await import('./valid-capture-line/valid-capture-line.module'))
        .validCaptureLineModule,
    data: { title: 'Valida línea captura', screen: 'ValidaLC' },
  },
  {
    path: 'report-oi',
    loadChildren: async () =>
      (await import('./report-oi/report-oi.module')).reportOiModule,
    data: { title: 'Reporte OI', screen: 'Reportes_OI' },
  },
  {
    path: 'billing-payments',
    loadChildren: async () =>
      (await import('./billing-payments/billing-payments.module'))
        .billingPaymentsModule,
    data: { title: 'Pagos facturación', screen: 'Factura_Pagos' },
  },
  {
    path: 'proof-delivery',
    loadChildren: async () =>
      (await import('./proof-delivery/proof-delivery.module'))
        .proofDeliveryModule,
    data: { title: 'Constancia de entrega', screen: 'ConstanciaEntrega' },
  },
  {
    path: 'report-invoices',
    loadChildren: async () =>
      (await import('./report-invoices/report-invoices.module'))
        .reportInvoicesModule,
    data: { title: 'Reporte de facturas', screen: 'ReporteCFDI' },
  },
  {
    path: 'report-batches-pending',
    loadChildren: async () =>
      (await import('./report-batches-pending/report-batches-pending.module'))
        .reportBatchesPendingModule,
    data: {
      title: 'Reporte de lotes pendientes de liquidar',
      screen: 'ReportePendientesPago',
    },
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
    data: { title: 'Carga de Avalúos', screen: 'CargaAvaluos' },
  },
  {
    path: 'monitoring-cps-sps-tabs',
    loadChildren: async () =>
      (await import('./monitoring-cps-sps-tabs/monitoring-cps-sps-tabs.module'))
        .MonitoringCpsSpsTabsModule,
    data: { title: 'Monitoreo de cps y sps', screen: 'InconsistenciasPagos' },
  },
  {
    path: 'batch-status-monitoring',
    loadChildren: async () =>
      (await import('./batch-status-monitoring/batch-status-monitoring.module'))
        .BatchStatusMonitoringModule,
    data: { title: 'Monitoreo estatus lotes', screen: 'frmCambioEstatus' },
  },
  {
    path: 'report-exposure-for-sale',
    loadChildren: async () =>
      (
        await import(
          './report-exposure-for-sale/report-exposure-for-sale.module'
        )
      ).ReportExposureForSaleModule,
    data: { title: 'Reporte exposición a venta', screen: 'ReporteExpVta' },
  },
  {
    path: 'report-sales-attempts',
    loadChildren: async () =>
      (await import('./report-sales-attempts/report-sales-attempts.module'))
        .ReportSalesAttemptsModule,
    data: {
      title: 'Reporte intentos de venta',
      screen: 'ReporteIntentosVenta',
    },
  },
  {
    path: 'report-unsold-goods',
    loadChildren: async () =>
      (await import('./report-unsold-goods/report-unsold-goods.module'))
        .ReportUnsoldGoodsModule,
    data: { title: 'Reporte bienes sin vender', screen: 'frmReporteBienes540' },
  },
  {
    path: 'payload',
    loadChildren: async () =>
      (await import('./payload/payload.module')).PayloadModule,
    data: { title: 'Carga de pagos', scree: 'CargaPagos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
