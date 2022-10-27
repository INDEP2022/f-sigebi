import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercializationComponent } from './commercialization.component';

const routes: Routes = [
  {
    path: 'c-b-f-fmdvdb-m-event-preparation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-f-fmdvdb-m-event-preparation/c-b-f-fmdvdb-m-event-preparation.module'
        )
      ).CBFFmdvdbMEventPreparationModule,
    data: { title: 'Preparación del evento' },
  },
  {
    path: 'c-b-vdp-m-payment-dispersion-validation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-vdp-m-payment-dispersion-validation/c-b-vdp-m-payment-dispersion-validation.module'
        )
      ).CBVdpMPaymentDispersionValidationModule,
    data: { title: 'Validación de bienes' },
  },
  {
    path: 'c-b-bedv-m-validation-exempted-goods',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-bedv-m-validation-exempted-goods/c-b-bedv-m-validation-exempted-goods.module'
        )
      ).CBBedvMValidationExemptedGoodsModule,
    data: { title: 'Bienes exentos de validación' },
  },
  {
    path: 'c-b-rdodi-m-reclass-recovery-orders',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-rdodi-m-reclass-recovery-orders/c-b-rdodi-m-reclass-recovery-orders.module'
        )
      ).CBRdodiMReclassRecoveryOrdersModule,
    data: { title: 'Reclasificación OI' },
  },
  {
    path: 'numeraire-conversion-tabs',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/numeraire-conversion-tabs/numeraire-conversion-tabs.module'
        )
      ).NumeraireConversionTabsModule,
    data: { title: 'Conversión a numerario' },
  },
  {
    path: 'c-b-a-cda-m-appraisal-consultation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-a-cda-m-appraisal-consultation/c-b-a-cda-m-appraisal-consultation.module'
        )
      ).CBACdaMAppraisalConsultationModule,
    data: { title: 'Consulta de Avalúo' },
  },
  {
    path: 'c-b-a-rda-m-appraisal-registration',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-a-rda-m-appraisal-registration/c-b-a-rda-m-appraisal-registration.module'
        )
      ).CBARdaMAppraisalRegistrationModule,
    data: { title: 'Registro de Avalúos' },
  },
  {
    path: 'c-b-ge-cdg-m-expense-capture',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-ge-cdg-m-expense-capture/c-b-ge-cdg-m-expense-capture.module'
        )
      ).CBGeCdgMExpenseCaptureModule,
    data: { title: 'Captura de gastos' },
  },
  {
    path: 'catalogs',
    loadChildren: async () =>
      (await import('./catalogs/catalogs.module')).CatalogsModule,
  },
  {
    path: 'c-bm-ge-cdc-tc-m-third-party-marketers',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-ge-cdc-tc-m-third-party-marketers/c-bm-ge-cdc-tc-m-third-party-marketers.module'
        )
      ).CBmGeCdcTcMThirdPartyMarketersModule,
    data: { title: 'Terceros comercializadores' },
  },
  {
    path: 'consultation-goods-commercial-process-tabs',
    loadChildren: async () =>
      (
        await import(
          './movable-property/consultation-goods-commercial-process-tabs/consultation-goods-commercial-process-tabs.module'
        )
      ).ConsultationGoodsCommercialProcessTabsModule,
    data: { title: 'Consulta de bienes' },
  },
  {
    path: 'c-bm-ge-cdc-clc-m-calculate-commission',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-ge-cdc-clc-m-calculate-commission/c-bm-ge-cdc-clc-m-calculate-commission.module'
        )
      ).CBmGeCdcClcMCalculateCommissionModule,
    data: { title: 'Calcular comisión' },
  },
  {
    path: 'c-bm-f-syf-m-series-folios-control',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-f-syf-m-series-folios-control/c-bm-f-syf-m-series-folios-control.module'
        )
      ).CBmFSyfMSeriesFoliosControlModule,
    data: { title: 'Folios y series' },
  },
  {
    path: 'c-bm-f-cdr-m-rebilling-causes',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-f-cdr-m-rebilling-causes/c-bm-f-cdr-m-rebilling-causes.module'
        )
      ).CBmFCdrMRebillingCausesModule,
    data: { title: 'Causas de Refacturación' },
  },
  {
    path: 'c-bm-f-edf-m-invoice-status',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-f-edf-m-invoice-status/c-bm-f-edf-m-invoice-status.module'
        )
      ).CBmFEdfMInvoiceStatusModule,
    data: { title: 'Estatus de la facturación' },
  },
  {
    path: 'expense-concepts',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/expense-concepts/c-b-ec-m-expense-concepts.module'
        )
      ).CBEcMPaymentsConceptsModule,
    data: { title: 'Conceptos de Gasto' },
  },
  {
    path: 'referenced-payment',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/referenced-payment/c-b-rp-m-referenced-payment.module'
        )
      ).CBRpMReferencedPaymentModule,
    data: { title: 'Pagos Referenciados' },
  },
  {
    path: 'unreconciled-payment',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/unreconciled-payment/c-b-up-m-unreconciled-payment.module'
        )
      ).CBUpMUnreconciledPaymentModule,
    data: { title: 'Pagos no Conciliados' },
  },
  {
    path: 'payment-dispersion-monitor',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/payment-dispersion-monitor/c-b-pdm-m-payment-dispersion-monitor.module'
        )
      ).CBPdmMPaymentDispersionMonitorModule,
    data: { title: 'Dispersión de Pagos' },
  },
  {
    path: 'events',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/events/c-b-e-m-events.module'
        )
      ).CBEMEventsModule,
    data: { title: 'Permisos a Eventos' },
  },
  {
    path: 'numeraire-exchange',
    loadChildren: async () =>
      (await import('./numeraire-exchange/numeraire-exchange.module'))
        .NumeraireExchangeModule,
    data: { title: 'Cambio a Numerario' },
  },
  {
    path: 'sirsae-payment-consultation',
    loadChildren: async () =>
      (
        await import(
          './c-m-sirsae-payment-consultation/c-m-sirsae-payment-consultation.module'
        )
      ).CMSirsaePaymentConsultationModule,
    data: { title: 'Consulta de Pagos Sirsae' },
  },
  {
    path: 'lcs-massive-conversion',
    loadChildren: async () =>
      (
        await import(
          './c-m-lcs-massive-conversion/c-m-lcs-massive-conversion.module'
        )
      ).CMLcsMassiveConversionModule,
    data: { title: 'Conversión Masiva de LCs' },
  },
  {
    path: 'mass-biling-base-sales-tab',
    loadChildren: async () =>
      (
        await import(
          './movable-property/mass-biling-base-sales-tab/mass-biling-base-sales-tab.module'
        )
      ).MassBilingBaseSalesTabModule,
    data: { title: 'Facturación masiva de VTA. de bases ' },
  },
  {
    path: 'batch-parameters',
    loadChildren: async () =>
      (await import('./c-m-batch-parameters/c-m-batch-parameters.module'))
        .CMBatchParametersModule,
    data: { title: 'Parámetros por Lote' },
  },
  {
    path: 'related-events',
    loadChildren: async () =>
      (await import('./c-m-related-events/c-m-related-events.module'))
        .CMRelatedEventsModule,
    data: { title: 'Eventos Relacionados' },
  },
  {
    path: 'regular-billing-tab',
    loadChildren: async () =>
      (
        await import(
          './movable-property/regular-billing-tab/regular-billing-tab.module'
        )
      ).RegularBillingTabModule,
    data: { title: 'Facturación normal' },
  },
  {
    path: 'payment-search',
    loadChildren: async () =>
      (await import('./c-m-payment-search/c-m-payment-search.module'))
        .CMPaymentSearchModule,
    data: { title: 'Búsqueda y Procesamiento de Pagos' },
  },
  {
    path: 'electronic-signatures',
    loadChildren: async () =>
      (
        await import(
          './c-m-electronic-signatures/c-m-electronic-signatures.module'
        )
      ).CMElectronicSignaturesModule,
    data: { title: 'Gestión de Firmas Electrónicas' },
  },
  {
    path: 'payment-refund',
    loadChildren: async () =>
      (await import('./c-m-payment-refund/c-m-payment-refund.module'))
        .CMPaymentRefundModule,
    data: { title: 'Devolución de Pagos' },
  },
];

@NgModule({
  declarations: [CommercializationComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
