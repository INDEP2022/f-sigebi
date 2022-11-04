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
    path: 'c-bm-f-fr-cr-m-rectification-fields',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-f-fr-cr-m-rectification-fields/c-bm-f-fr-cr-m-rectification-fields.module'
        )
      ).CBmFFrCrMRectificationFieldsModule,
    data: { title: 'Campos rectificación' },
  },
  {
    path: 'c-bm-f-fr-prdf-m-invoice-rectification-process',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-f-fr-prdf-m-invoice-rectification-process/c-bm-f-fr-prdf-m-invoice-rectification-process.module'
        )
      ).CBmFFrPrdfMInvoiceRectificationProcessModule,
    data: { title: 'Formato de rectificación' },
  },
  {
    path: 'c-bm-vm-m-cp-page-setup',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-vm-m-cp-page-setup/c-bm-vm-m-cp-page-setup.module'
        )
      ).CBmVmMCpPageSetupModule,
    data: { title: 'Configuración de Página' },
  },
  {
    path: 'c-bm-vm-cde-m-entity-classification',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-vm-cde-m-entity-classification/c-bm-vm-cde-m-entity-classification.module'
        )
      ).CBmVmCdeMEntityClassificationModule,
    data: { title: 'Catálogo de Entidades' },
  },
  {
    path: 'payment-refund',
    loadChildren: async () =>
      (await import('./c-m-payment-refund/c-m-payment-refund.module'))
        .CMPaymentRefundModule,
    data: { title: 'Devolución de Pagos' },
  },
  {
    path: 'mandate-income-reports',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/mandate-income-reports/c-b-mir-m-mandate-income-reports.module'
        )
      ).CBMirMMandateIncomeReportsModule,
    data: { title: 'Reporte de Ing. por Mandato' },
  },
  {
    path: 'c-bm-r-rrpr-m-remittances-recorded-region',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-r-rrpr-m-remittances-recorded-region/c-bm-r-rrpr-m-remittances-recorded-region.module'
        )
      ).CBmRRrprMRemittancesRecordedRegionModule,
    data: { title: 'Remesas registradas por regional' },
  },
  {
    path: 'c-bm-r-exdlr-m-remittance-exportation',
    loadChildren: async () =>
      (
        await import(
          './movable-property/c-bm-r-exdlr-m-remittance-exportation/c-bm-r-exdlr-m-remittance-exportation.module'
        )
      ).CBmRExdlrMRemittanceExportationModule,
    data: { title: 'Exportación de las Remesas' },
  },
  {
    path: 'c-b-r-oim-electronic-signature-auxiliary-catalogs',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-r-oim-m-signture-auxiliary-catalogs/c-b-r-oim-m-signture-auxiliary-catalogs.module'
        )
      ).CBROimMSigntureAuxiliaryCatalogsModule,
    data: { title: 'Catálogos Auxiliares para Firmas Electrónicas' },
  },
  {
    path: 'direct-sale-requests-capture/municipality-control',
    loadChildren: async () =>
      (
        await import(
          './direct-sale-requests-capture/c-csvd-m-municipality-control/c-csvd-m-municipality-control.module'
        )
      ).CCsvdMMunicipalityControlModule,
    data: { title: 'Control de Municipios' },
  },
  {
    path: 'billing',
    loadChildren: async () =>
      (await import('./c-fp-m-penalty-billing/c-fp-m-penalty-billing.module'))
        .CFpMPenaltyBillingModule,
    data: { title: 'Facturación' },
  },
  {
    path: 'c-b-ems-sirsae-movement-sending',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-ems-m-sirsae-movement-sending/c-b-ems-m-sirsae-movement-sending.module'
        )
      ).CBEmsMSirsaeMovementSendingModule,
    data: { title: 'Envío de Movimientos a SIRSAE' },
  },
  {
    path: 'c-b-pdp-ec-conciliation-execution',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/c-b-pdp-ec-m-conciliation-execution/c-b-pdp-ec-m-conciliation-execution.module'
        )
      ).CBPdpEcMConciliationExecutionModule,
    data: { title: 'Ejecución de la Conciliación' },
  },
  {
    path: 'tax-validation-calculation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/tax-calculation-validation/c-b-tcv-m-tax-validation-calculation.module'
        )
      ).CBTcvMTaxValidationCalculationModule,
    data: { title: 'Validación de Cálculo I.V.A' },
  },
];

@NgModule({
  declarations: [CommercializationComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
