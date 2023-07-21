import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'articles-complement',
    loadChildren: () =>
      import('./complement-article/complement-article.module').then(
        m => m.ComplementArticleModule
      ),
    data: {
      screen: 'FACTREFAVALUOBIEN',
      title: 'Datos complementarios Art. 6, 7 y 4',
    },
  },
  {
    path: 'confiscated-reception',
    loadChildren: () =>
      import('./confiscated-reception/confiscated-reception.module').then(
        m => m.ConfiscatedReceptionModule
      ),
    data: { screen: '', title: 'Recepción de Decomisos' },
  },
  {
    path: 'records-report',
    loadChildren: () =>
      import('./records-report/records-report.module').then(
        m => m.RecordsReportModule
      ),
    data: {
      screen: 'FREPREFACTAENTREC',
      title: 'Reporte Actas de Entrega Recepción',
    },
  },
  {
    path: 'confiscated-records',
    loadChildren: () =>
      import('./confiscated-records/confiscated-records.module').then(
        m => m.ConfiscatedRecordsModule
      ),
    data: { screen: 'FACTREFACTAENTREC', title: 'Actas de Recepción' },
  },
  {
    path: 'partializes-general-goods',
    loadChildren: () =>
      import(
        './partializes-general-goods-1/partializes-general-goods.module'
      ).then(m => m.PartializesGeneralGoodsModule),
    data: {
      screen: 'FACTGENPARCBIEN',
      title: 'Parcialización de Bienes Generales',
    },
  },
  {
    path: 'goods-null',
    loadChildren: () =>
      import('./goods-null/goods-null.module').then(m => m.GoodsNullModule),
    data: {
      screen: '',
      title: 'Listado de bienes con información requerida nula',
    },
  },
  // {
  //   path: 'partializes-general-goods-2',
  //   loadChildren: () =>
  //     import(
  //       './partializes-general-goods-2/partializes-general-goods.module'
  //     ).then(m => m.PartializesGeneralGoodsModule),
  // },
  {
    path: 'partializes-goods',
    loadChildren: () =>
      import('./partializes-goods/partializes-goods.module').then(
        m => m.PartializesGoodsModule
      ),
    data: { screen: 'FBIENESPARCIALIZADOS', title: 'Bienes Parcializados' },
  },
  {
    path: 'cancellation-recepcion',
    loadChildren: () =>
      import('./cancellation-recepcion/cancellation-recepcion.module').then(
        m => m.CancellationRecepcionModule
      ),
    data: {
      screen: 'FACTREFCANCELAR',
      title: 'Recepción Suspensión/Cancelación',
    },
  },
  {
    path: 'cancellation-sale',
    loadChildren: () =>
      import('./sale-cancellation/sale-cancellation.module').then(
        m => m.SaleCancellationModule
      ),
    data: {
      screen: 'FACTREFACTAVENT',
      title: 'Devolución por Cancelación de Venta',
    },
  },
  {
    path: 'scheduled-maintenance',
    loadChildren: () =>
      import('./scheduled-maintenance/scheduled-maintenance.module').then(
        m => m.ScheduledMaintenanceModule
      ),
    data: { screen: 'FINDICA_0035', title: 'Programación de Recepciones' },
  },
  {
    path: 'scheduled-maintenance-1',
    loadChildren: () =>
      import('./scheduled-maintenance-1/scheduled-maintenance.module').then(
        m => m.ScheduledMaintenanceModule
      ),
    data: { screen: 'FMENTREC_0001', title: 'Mantenimiento de Programaciones' },
  },
  {
    path: 'maintenance-records',
    loadChildren: () =>
      import('./maintenance-records/maintenance-records.module').then(
        m => m.MaintenanceRecordsModule
      ),
    data: { screen: 'FACTREFACTAERCIER', title: 'Mantenimiento de Actas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JudicialPhysicalReceptionRoutingModule {}
