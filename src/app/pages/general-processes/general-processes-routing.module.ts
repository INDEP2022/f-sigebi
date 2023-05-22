import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'notifications-association',
    data: {
      screen: 'FACTGENASOCIANOTI',
      title: 'Asociación de Notificaciones',
    },
    loadChildren: async () =>
      (
        await import(
          './notification-association/notification-association.module'
        )
      ).NotificationAssociationModule,
  },
  {
    path: 'goods-characteristics',
    data: { screen: 'FACTDIRDATOSBIEN', title: 'Características del Bien' },
    loadChildren: async () =>
      (await import('./goods-characteristics/goods-characteristics.module'))
        .GoodsCharacteristicsModule,
  },
  {
    path: 'historical-good-situation',
    data: {
      screen: 'FCONGENHISTSTATUS',
      title: 'Situación Historica del Bien',
    },
    loadChildren: async () =>
      (
        await import(
          './historical-good-situation/historical-good-situation.module'
        )
      ).HistoricalGoodSituationModule,
  },
  {
    path: 'purging-records',
    data: { screen: 'FACTGENDEPURAEXPE', title: 'Depuración de Expedientes' },
    loadChildren: async () =>
      (await import('./purging-records/purging-records.module'))
        .PurgingRecordsModule,
  },
  {
    path: 'goods-tracker',
    data: { screen: 'FCONGENRASTREADOR', title: 'Rastreador de Bienes' },
    loadChildren: async () =>
      (await import('./goods-tracker/goods-tracker.module')).GoodsTrackerModule,
  },
  {
    path: 'records-tracker',
    data: { screen: ' FCONGENRASTEXPEDI', title: 'Rastreador de Expedientes' },
    loadChildren: async () =>
      (await import('./records-tracker/records-tracker.module'))
        .RecordsTrackerModule,
  },
  {
    path: 'scan-request',
    data: { screen: 'FACTGENSOLICDIGIT', title: 'Solicitud de Digitalización' },
    loadChildren: async () =>
      (await import('./scan-request/scan-request.module')).ScanRequestModule,
  },
  {
    path: 'documents-viewer',
    data: { screen: 'FCONGENVISUADIGIT', title: 'Vizualizar Documentos' },
    loadChildren: async () =>
      (await import('./documents-viewer/documents-viewer.module'))
        .DocumentsViewerModule,
  },
  {
    path: 'system-log',
    data: { screen: 'FCONGENBITACORA', title: 'Bitácora del sistema' },
    loadChildren: async () =>
      (await import('./system-log/system-log.module')).SystemLogModule,
  },
  {
    path: 'indicators',
    data: { screen: '', title: '' },
    loadChildren: async () =>
      (await import('./indicators/indicators.module')).IndicatorsModule,
  },
  {
    path: 'bulk-technical-sheets-generation',
    data: {
      screen: ' FMASGENFICHATEC',
      title: 'Generación de Fichas Técnicas',
    },
    loadChildren: async () =>
      (
        await import(
          './bulk-technical-sheets-generation/bulk-technical-sheets-generation.module'
        )
      ).BulkTechnicalSheetsGenerationModule,
  },
  {
    path: 'image-debugging',
    data: { screen: 'FDEPURAFOTOS', title: 'Depuración de Fotografías' },
    loadChildren: async () =>
      (await import('./image-debugging/image-debugging.module'))
        .ImageDebuggingModule,
  },
  {
    path: 'status-change', //! no se migra
    data: { screen: '', title: '' },
    loadChildren: async () =>
      (await import('./status-change/status-change.module')).StatusChangeModule,
  },
  {
    path: 'mass-goods-deletion', // ! no se migra
    data: { screen: '', title: '' },
    loadChildren: async () =>
      (await import('./mass-goods-deletion/mass-goods-deletion.module'))
        .MassGoodsDeletionModule,
  },
  {
    path: 'goods-partialization',
    data: { screen: 'FACTGENPARCIALIZA', title: 'Parcialización de Bienes' },
    loadChildren: async () =>
      (await import('./goods-partialization/goods-partialization.module'))
        .GoodsPartializationModule,
  },
  {
    path: 'goods-with-required-information',
    data: {
      screen: 'FATRIBREQUERIDO',
      title: 'Bienes con Atributos Requeridos',
    },
    loadChildren: async () =>
      (
        await import(
          './goods-with-required-info/goods-with-required-info.module'
        )
      ).GoodsWithRequiredInfoModule,
  },
  {
    path: 'trades-registration', //! no se migra
    loadChildren: async () =>
      (await import('./trades-registration/trades-registration.module'))
        .TradesRegistrationModule,
  },
  {
    path: 'valid-statuses',
    data: { screen: 'FCONGENSTATUSXPAN', title: 'Estatus Valído por Pantalla' },
    loadChildren: async () =>
      (await import('./valid-statuses/valid-statuses.module'))
        .ValidStatusesModule,
  },
  {
    path: 'work-mailbox',
    data: { screen: 'FGESTBUZONTRAMITE', title: 'Buzón de Trabajo' },
    loadChildren: async () =>
      (await import('./work-mailbox/work-mailbox.module')).WorkMailboxModule,
  },
  {
    path: 'scan-documents',
    data: { screen: 'FIMGDOCEXPADD', title: 'Escaneo de documentos' },
    loadChildren: async () =>
      (await import('./scan-documents/scan-documents.module'))
        .ScanDocumentsModule,
  },
  {
    path: 'help-screen',
    data: { screen: 'FINDCA_AYADA', title: 'Pantalla de Ayuda' },
    loadChildren: async () =>
      (await import('./help-screen/help-screen.module')).HelpScreenModule,
  },
  {
    path: 'tree-report',
    data: { screen: 'FREPARBOLDENIVEL', title: 'Reporte de Arból' },
    loadChildren: async () =>
      (await import('./tree-report/tree-report.module')).TreeReportModule,
  },
  {
    path: 'coordination',
    data: { screen: 'FSELCOORDINACION', title: 'Cordinación' },
    loadChildren: async () =>
      (await import('./coordination/coordination.module')).CoordinationModule,
  },
  {
    path: 'transfer',
    data: {
      screen: 'FSELTRANSFERENTE',
      title: 'Transferente / Emisor / Autoridad',
    },
    loadChildren: async () =>
      (await import('./transfer/transfer.module')).TransferModule,
  },
  {
    path: 'text-change',
    data: { screen: 'TEXTO', title: 'Cambio Texto de Oficios' },
    loadChildren: async () =>
      (await import('./text-change/text-change.module')).TextChangeModule,
  },
  {
    path: 'text-change-mod',
    data: { screen: 'TEXTO_MOD', title: 'Cambio Texto de Oficios Mod' },
    loadChildren: async () =>
      (await import('./text-change-mod/text-change-mod.module'))
        .TextChangeModModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralProcessesRoutingModule {}
