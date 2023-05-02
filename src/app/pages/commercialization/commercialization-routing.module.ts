import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercializationComponent } from './commercialization.component';

const routes: Routes = [
  {
    path: 'event-preparation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/event-preparation/event-preparation.module'
        )
      ).EventPreparationModule,
    data: { title: 'Preparación del evento', screen: 'FCOMEREVENTOS' },
  },
  {
    path: 'payment-dispersion-validation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/payment-dispersion-validation/payment-dispersion-validation.module'
        )
      ).PaymentDispersionValidationModule,
    data: { title: 'Validación de bienes', screen: 'FCOMER0115' },
  },
  {
    path: 'validation-exempted-goods',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/validation-exempted-goods/validation-exempted-goods.module'
        )
      ).ValidationExemptedGoodsModule,
    data: { title: 'Bienes exentos de validación', screen: 'FCOMERBIENEX' },
  },
  {
    path: 'reclass-recovery-orders',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/reclass-recovery-orders/reclass-recovery-orders.module'
        )
      ).ReclassRecoveryOrdersModule,
    data: { title: 'Reclasificación OI', screen: 'FCOMER085' },
  },
  {
    path: 'numeraire-conversion-tabs',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/numeraire-conversion-tabs/numeraire-conversion-tabs.module'
        )
      ).NumeraireConversionTabsModule,
    data: { title: 'Conversión a numerario', screen: 'FCOMER087' },
  },
  {
    path: 'appraisal-consultation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/appraisal-consultation/appraisal-consultation.module'
        )
      ).AppraisalConsultationModule,
    data: { title: 'Consulta de Avalúo', screen: 'FCOMERCONSAVALUO' },
  },
  {
    path: 'appraisal-registration',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/appraisal-registration/appraisal-registration.module'
        )
      ).AppraisalRegistrationModule,
    data: { title: 'Registro de Avalúos', screen: 'FCOMERREGAVALUO' },
  },
  {
    path: 'expense-capture',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/expense-capture/expense-capture.module'
        )
      ).ExpenseCaptureModule,
    data: { title: 'Captura de gastos', screen: 'FCOMER084' },
  },
  {
    path: 'catalogs',
    loadChildren: async () =>
      (await import('./catalogs/catalogs.module')).CatalogsModule,
  },
  {
    path: 'third-party-marketers',
    loadChildren: async () =>
      (
        await import(
          './movable-property/third-party-marketers/third-party-marketers.module'
        )
      ).ThirdPartyMarketersModule,
    data: { title: 'Terceros comercializadores', screen: 'FCOMER063' },
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
    path: 'calculate-commission',
    loadChildren: async () =>
      (
        await import(
          './movable-property/calculate-commission/calculate-commission.module'
        )
      ).CalculateCommissionModule,
    data: { title: 'Calcular comisión', screen: 'FCOMER064' },
  },
  {
    path: 'series-folios-control',
    loadChildren: async () =>
      (
        await import(
          './movable-property/series-folios-control/series-folios-control.module'
        )
      ).SeriesFoliosControlModule,
    data: { title: 'Folios y series', screen: 'FCOMER093' },
  },
  {
    path: 'rebilling-causes',
    loadChildren: async () =>
      (
        await import(
          './movable-property/rebilling-causes/rebilling-causes.module'
        )
      ).RebillingCausesModule,
    data: { title: 'Causas de Refacturación', screen: 'FCOMER091' },
  },
  {
    path: 'invoice-status',
    loadChildren: async () =>
      (await import('./movable-property/invoice-status/invoice-status.module'))
        .InvoiceStatusModule,
    data: { title: 'Estatus de la facturación', screen: 'FCOMER072' },
  },
  {
    path: 'expense-concepts',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/expense-concepts/expense-concepts.module'
        )
      ).ExpenseConceptsModule,
    data: { title: 'Conceptos de Gasto' },
  },
  {
    path: 'referenced-payment',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/referenced-payment/referenced-payment.module'
        )
      ).ReferencedPaymentModule,
    data: { title: 'Pagos Referenciados' },
  },
  {
    path: 'unreconciled-payment',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/unreconciled-payment/unreconciled-payment.module'
        )
      ).UnreconciledPaymentModule,
    data: { title: 'Pagos no Conciliados' },
  },
  {
    path: 'payment-dispersion-monitor',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/payment-dispersion-monitor/payment-dispersion-monitor.module'
        )
      ).PaymentDispersionMonitorModule,
    data: { title: 'Dispersión de Pagos' },
  },
  {
    path: 'events',
    loadChildren: async () =>
      (await import('./shared-marketing-components/events/events.module'))
        .EventsModule,
    data: { title: 'Delegar Permisos a Eventos', screen: 'EventsModule' },
  },
  {
    path: 'numeraire-exchange',
    loadChildren: async () =>
      (await import('./numeraire-exchange/numeraire-exchange.module'))
        .NumeraireExchangeModule,
    data: { title: 'Cambio a Numerario', screen: 'FACTADBCAMBIONUME' },
  },
  {
    path: 'sirsae-payment-consultation',
    loadChildren: async () =>
      (
        await import(
          './sirsae-payment-consultation/sirsae-payment-consultation.module'
        )
      ).SirsaePaymentConsultationModule,
    data: { title: 'Consulta de Pagos Sirsae', screen: 'FCOM_CONSPAGSIRSAE' },
  },
  {
    path: 'lcs-massive-conversion',
    loadChildren: async () =>
      (await import('./massive-conversion/massive-conversion.module'))
        .MassiveConversionModule,
    data: { title: 'Conversión Masiva de LCs', screen: 'FCOMERGENLCMASIV' },
  },
  {
    path: 'mass-biling-base-sales-tab',
    loadChildren: async () =>
      (
        await import(
          './movable-property/mass-biling-base-sales-tab/mass-biling-base-sales-tab.module'
        )
      ).MassBilingBaseSalesTabModule,
    data: {
      title: 'Facturación masiva de VTA. de bases',
      screen: 'FCOMER_VTA_BASES',
    },
  },
  {
    path: 'batch-parameters',
    loadChildren: async () =>
      (await import('./batch-parameters/batch-parameters.module'))
        .CMBatchParametersModule,
    data: { title: 'Parámetros por Lote', screen: 'FCOMERPARAMLOTE' },
  },
  {
    path: 'related-events',
    loadChildren: async () =>
      (await import('./related-events/related-events.module'))
        .RelatedEventsModule,
    data: { title: 'Eventos Relacionados', screen: 'FCOMEREVEREL' },
  },
  {
    path: 'regular-billing-tab',
    loadChildren: async () =>
      (
        await import(
          './movable-property/regular-billing-tab/regular-billing-tab.module'
        )
      ).RegularBillingTabModule,
    data: { title: 'Facturación normal', screen: 'FCOMER086' },
  },
  {
    path: 'payment-search',
    loadChildren: async () =>
      (await import('./payment-search/payment-search.module'))
        .PaymentSearchModule,
    data: {
      title: 'Búsqueda y Procesamiento de Pagos',
      screen: 'FCOMER_PAGOS',
    },
  },
  {
    path: 'electronic-signatures',
    loadChildren: async () =>
      (await import('./electronic-signatures/electronic-signatures.module'))
        .ElectronicSignaturesModule,
    data: {
      title: 'Gestión de Firmas Electrónicas',
      screen: 'FCOMER_CTLFIRMAS_ELEC',
    },
  },
  {
    path: 'rectification-fields',
    loadChildren: async () =>
      (
        await import(
          './movable-property/rectification-fields/rectification-fields.module'
        )
      ).RectificationFieldsModule,
    data: { title: 'Campos rectificación', screen: 'FCOMER070' },
  },
  {
    path: 'invoice-rectification-process',
    loadChildren: async () =>
      (
        await import(
          './movable-property/invoice-rectification-process/invoice-rectification-process.module'
        )
      ).InvoiceRectificationProcessModule,
    data: { title: 'Formato de rectificación', screen: 'FCOMER097' },
  },
  {
    path: 'page-setup',
    loadChildren: async () =>
      (await import('./movable-property/page-setup/page-setup.module'))
        .PageSetupModule,
    data: { title: 'Configuración de Página', screen: 'FCOMER090' },
  },
  {
    path: 'entity-classification',
    loadChildren: async () =>
      (
        await import(
          './movable-property/entity-classification/entity-classification.module'
        )
      ).EntityClassificationModule,
    data: { title: 'Catálogo de Entidades', screen: 'FCOMER088' },
  },
  {
    path: 'payment-refund',
    loadChildren: async () =>
      (await import('./payment-refund/payment-refund.module'))
        .PaymentRefundModule,
    data: { title: 'Devolución de Pagos', screen: 'FCOMERCTLDPAG' },
  },
  {
    path: 'mandate-income-reports',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/mandate-income-reports/mandate-income-reports.module'
        )
      ).MandateIncomeReportsModule,
    data: { title: 'Reporte de Ing. por Mandato' },
  },
  {
    path: 'remittances-recorded-region',
    loadChildren: async () =>
      (
        await import(
          './movable-property/remittances-recorded-region/remittances-recorded-region.module'
        )
      ).RemittancesRecordedRegionModule,
    data: {
      title: 'Remesas registradas por regional',
      screen: 'RCOMERREMESA1',
    },
  },
  {
    path: 'remittance-exportation',
    loadChildren: async () =>
      (
        await import(
          './movable-property/remittance-exportation/remittance-exportation.module'
        )
      ).RemittanceExportationModule,
    data: { title: 'Exportación de las Remesas', screen: 'RCOMERREMESA2' },
  },
  {
    path: 'electronic-signature-auxiliary-catalogs',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/signature-auxiliary-catalogs/signature-auxiliary-catalogs.module'
        )
      ).SignatureAuxiliaryCatalogsModule,
    data: {
      title: 'Catálogos Auxiliares para Firmas Electrónicas',
      screen: 'FCOMER_CAT_FELEC',
    },
  },
  {
    path: 'direct-sale-requests-capture/municipality-control',
    loadChildren: async () =>
      (
        await import(
          './direct-sale-requests-capture/municipality-control/municipality-control.module'
        )
      ).MunicipalityControlModule,
    data: { title: 'Control de Municipios', screen: 'FCOMER089' },
  },
  {
    path: 'billing',
    loadChildren: async () =>
      (await import('./penalty-billing/penalty-billing.module'))
        .CFpMPenaltyBillingModule,
    data: { title: 'Facturación', screen: 'FCOMER089' },
  },
  {
    path: 'sirsae-movement-sending',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/sirsae-movement-sending/sirsae-movement-sending.module'
        )
      ).SirsaeMovementSendingModule,
    data: { title: 'Envío de Movimientos a SIRSAE', screen: 'FCOMER112' },
  },
  {
    path: 'conciliation-execution',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/conciliation-execution/conciliation-execution.module'
        )
      ).ConciliationExecutionModule,
    data: { title: 'Ejecución de la Conciliación', screen: 'FCOMER612' },
  },
  {
    path: 'tax-validation-calculation',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/tax-calculation-validation/tax-validation-calculation.module'
        )
      ).TaxValidationCalculationModule,
    data: { title: 'Validación de Cálculo I.V.A' },
  },
  {
    path: 'partiality-direct-adjudication',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/partiality-direct-adjudication/partiality-direct-adjudication.module'
        )
      ).PartialityDirectAdjudicationModule,
    data: {
      title: 'Adjudicaciones Directas en Parcialidades',
      screen: 'FCOMERAMORTIZACIONES',
    },
  },
  {
    path: 'marketing-records',
    loadChildren: async () =>
      (
        await import(
          './shared-marketing-components/marketing-records/marketing-records.module'
        )
      ).MarketingRecordsModule,
    data: { title: 'Oficios de Comercialización' },
  },
  {
    path: 'good-delivery',
    loadChildren: async () =>
      (await import('./good-delivery/good-delivery.module')).GoodDeliveryModule,
    data: { title: 'Entrega de Bienes', screen: 'FCOMERCAMESTBIEN' },
  },
  {
    path: 'release-letter-report',
    loadChildren: async () =>
      (await import('./release-letter-report/release-letter-report.module'))
        .ReleaseLetterReportModule,
    data: {
      title: 'Reporte de Cartas de Liberacion',
      screen: 'FCOMERCARTALIB',
    },
  },
  {
    path: 'responsibility-letters-report',
    loadChildren: async () =>
      (
        await import(
          './responsibility-letters-report/responsibility-letters-report.module'
        )
      ).ResponsibilityLettersReportModule,
    data: {
      title: 'Reporte de Cartas de Responsabilidad',
      screen: 'FCOMERCARTARESP',
    },
  },
  {
    path: 'layouts-configuration',
    loadChildren: async () =>
      (await import('./layouts-configuration/layouts-configuration.module'))
        .LayoutsConfigurationModule,
    data: { title: 'Configuracion de Layouts', screen: ' FCOMERESPLAY' },
  },
  {
    path: 'property-adjudication-notification-report',
    loadChildren: async () =>
      (
        await import(
          './property-adjudication-notification-report/property-adjudication-notification-report.module'
        )
      ).PropertyAdjudicationNotificationReportModule,
    data: {
      title: 'Reporte de Notificacion de Adjudicacion Inmuebles',
      screen: 'FCOMERNOTIFICAINMU',
    },
  },
  //Henry2
  {
    path: 'publication-photographs',
    loadChildren: async () =>
      (await import('./publication-photographs/publication-photographs.module'))
        .PublicationPhotographsModule,
    data: { title: 'Publicación de fotografía', screen: 'FCOMERPUBLICFOTOS' },
  },
  {
    path: 'payment-receipts-report',
    loadChildren: async () =>
      (await import('./payment-receipts-report/payment-receipts-report.module'))
        .PaymentReceiptsReportModule,
    data: { title: 'Reporte de pagos recibidos', screen: 'FCOMERRECIBOS' },
  },
  {
    path: 'disposal-record-report',
    loadChildren: async () =>
      (await import('./disposal-record-report/disposal-record-report.module'))
        .DisposalRecordReportModule,
    data: {
      title: 'Reporte de actas de enajenación',
      screen: 'FGERDESACTAENAJEN',
    },
  },
  {
    path: 'traded-goods',
    loadChildren: async () =>
      (await import('./traded-goods/traded-goods.module'))
        .CBcMTradedGoodsModule,
    data: { title: 'Bienes comercializados', screen: 'FGERDESBIECOMERCI' },
  },
  {
    path: 'goods-tenders',
    loadChildren: async () =>
      (await import('./goods-tenders/goods-tenders.module'))
        .CLbMGoodsTendersModule,
    data: { title: 'Licitación de bienes', screen: 'FGERDESLICITXBIEN' },
  },
  {
    path: 'commercial-file',
    loadChildren: async () =>
      (await import('./commercial-file/commercial-file.module'))
        .CommercialFileModule,
    data: { title: 'Ficha comercial', screen: 'FINFFICHACOMERCIAL' },
  },
];

@NgModule({
  declarations: [CommercializationComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
