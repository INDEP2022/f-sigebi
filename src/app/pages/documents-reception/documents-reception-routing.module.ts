import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'flyers-registration',
    data: { screen: 'FACTOFPREGRECDOCM', title: 'Registro de Volantes' },
    children: [
      {
        path: '',
        loadChildren: async () =>
          (await import('./flyers/flyers.module')).FlyersModule,
      },
    ],
  },
  {
    path: 'documents-part-office',
    data: {
      screen: 'FOFPRECEPDOCUM_OFC',
      title: 'Recepción de Documentos (Oficialia de Partes)',
    },
    children: [
      {
        path: '',
        loadChildren: async () =>
          (await import('./documents-part-office/documents-part-office.module'))
            .DocumentsPartOfficeModule,
      },
    ],
  },
  {
    path: 'goods-capture',
    data: { screen: 'FACTOFPCAPTURABIE', title: 'Captura de Bienes' },
    loadChildren: async () =>
      (await import('./goods/goods.module')).GoodsModule,
  },
  {
    path: 'shipping-documents',
    data: { screen: 'FACTOFPOFICIOTURN', title: 'Envío de Oficios' },

    loadChildren: async () =>
      (await import('./shipping-documents/shipping-documents.module'))
        .ShippingDocumentsModule,
  },
  {
    path: 'print-flyers',
    data: {
      screen: 'FGEROFPOFIVOLANTE',
      title: 'Impresión Masiva de Volantes',
    },
    loadChildren: async () =>
      (await import('./print-flyers/print-flyers.module')).PrintFlyersModule,
  },
  {
    path: 'report',
    data: {
      screen: 'FGEROFPRECEPDOCUM',
      title: 'Reporte de Recepción Documental',
    },
    loadChildren: async () =>
      (await import('./report/report.module')).ReportModule,
  },
  {
    path: 'summary',
    data: {
      screen: 'FGEROFPRESUMENDIAA',
      title: 'Resumen Diario de Recepción Documental',
    },
    loadChildren: async () =>
      (await import('./summary/summary.module')).SummaryModule,
  },
  {
    path: 'notifications-flat-file',
    data: {
      screen: 'FGENADBNOTIFICACION',
      title: 'Archivo Plano de Notificaciones',
    },
    loadChildren: async () =>
      (await import('./flat-file-notifications/flat-file-notifications.module'))
        .FlatFileNotificationsModule,
  },
  {
    path: 'goods-bulk-load',
    data: {
      screen: 'FMASINSUPDBIENES',
      title: 'Carga y Actualización de Bienes',
    },
    loadChildren: async () =>
      (await import('./goods-bulk-load/goods-bulk-load.module'))
        .GoodsBulkLoadModule,
  },
  // { #### NO SE MIGRA ####
  //   path: 'sat-sae-goods-load',
  //   data: { screen: 'FMASINSBIENES_SATSAE', title: 'Carga de Bienes SAT SAE' },
  //   loadChildren: async () =>
  //     (await import('./sat-sae-goods-load/sat-sae-goods-load.module'))
  //       .SatSaeGoodsLoadModule,
  // },
  {
    path: 'sat-subjects-register',
    data: {
      screen: 'FACTOFPBUZONSAT',
      title: 'Registro de Buzón de Asuntos SAT',
    },
    loadChildren: async () =>
      (await import('./sat-subjects-register/sat-subjects-register.module'))
        .SatSubjectsRegisterModule,
  },
  {
    path: 'subjects-register',
    data: {
      screen: 'FACTOFPBUZONPGR',
      title: 'Registro de Buzón de Asuntos PGR',
    },
    loadChildren: async () =>
      (await import('./subjects-register/subjects-register.module'))
        .SubjectsRegisterModule,
  },
  /*#### NO SE MIGRA ####*/
  /*{
    path: 'documents-requirements-verification',
    data: {
      screen: 'FACTJURDICTAMPROC',
      title: 'Comprobación de Requisitos Documentales',
    },
    loadChildren: async () =>
      (
        await import(
          './documents-requirements-verification/documents-requirements-verification.module'
        )
      ).DocumentsRequirementsVerificationModule,
  },*/
  {
    path: 'closing-of-confiscation-and-return-records',
    data: { screen: 'FACTREFACTACIEDEV', title: 'Cierre de Actas de Decomiso' },
    loadChildren: async () =>
      (
        await import(
          './closing-confiscation-and-return-records/closing-confiscation-and-return-records.module'
        )
      ).ClosingConfiscationAndReturnRecordsModule,
  },
  {
    path: 'closing-of-confiscation-and-return-records/:fileNumber',
    data: { screen: 'FACTREFACTACIEDEV', title: 'Cierre de Actas de Decomiso' },
    loadChildren: async () =>
      (
        await import(
          './closing-confiscation-and-return-records/closing-confiscation-and-return-records.module'
        )
      ).ClosingConfiscationAndReturnRecordsModule,
  },
  /*{
    path: 'records-inventory',
    data: { screen: 'FACTREFINVXEXPEDI', title: 'Inventario por Expediente' },
    loadChildren: async () =>
      (await import('./records-inventory/records-inventory.module'))
        .RecordsInventoryModule,
  },*/
  {
    path: 'goods-forecast',
    data: { screen: 'FACTREFPREVISBIEN', title: 'Previsión de Bienes' },
    loadChildren: async () =>
      (await import('./goods-forecast/goods-forecast.module'))
        .GoodsForecastModule,
  },
  {
    path: 'records-validation/:fileNumber/:proceedingsNumb/:proceedingsCve',
    data: { screen: 'FVERIFACTA', title: 'Validación de Actas' },
    loadChildren: async () =>
      (await import('./records-validation/records-validation.module'))
        .RecordsValidationModule,
  },
  {
    path: 'goods-vigilance-service',
    data: { screen: 'FVIGBIEXCEP', title: 'Vigilancia de Bienes' },
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
