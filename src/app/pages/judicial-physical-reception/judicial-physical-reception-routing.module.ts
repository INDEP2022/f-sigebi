import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'articles-complement',
    loadChildren: () =>
      import('./complement-article/complement-article.module').then(
        m => m.ComplementArticleModule
      ),
  },
  {
    path: 'confiscated-reception',
    loadChildren: () =>
      import('./confiscated-reception/confiscated-reception.module').then(
        m => m.ConfiscatedReceptionModule
      ),
  },
  {
    path: 'records-report',
    loadChildren: () =>
      import('./records-report/records-report.module').then(
        m => m.RecordsReportModule
      ),
  },
  {
    path: 'confiscated-records',
    loadChildren: () =>
      import('./confiscated-records/confiscated-records.module').then(
        m => m.ConfiscatedRecordsModule
      ),
  },
  {
    path: 'partializes-general-goods-1',
    loadChildren: () =>
      import(
        './partializes-general-goods-1/partializes-general-goods.module'
      ).then(m => m.PartializesGeneralGoodsModule),
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
  },
  {
    path: 'cancellation-recepcion',
    loadChildren: () =>
      import('./cancellation-recepcion/cancellation-recepcion.module').then(
        m => m.CancellationRecepcionModule
      ),
  },
  {
    path: 'cancellation-sale',
    loadChildren: () =>
      import('./sale-cancellation/sale-cancellation.module').then(
        m => m.SaleCancellationModule
      ),
  },
  {
    path: 'scheduled-maintenance',
    loadChildren: () =>
      import('./scheduled-maintenance/scheduled-maintenance.module').then(
        m => m.ScheduledMaintenanceModule
      ),
  },
  {
    path: 'scheduled-maintenance-1',
    loadChildren: () =>
      import('./scheduled-maintenance-1/scheduled-maintenance.module').then(
        m => m.ScheduledMaintenanceModule
      ),
  },
  {
    path: 'maintenance-records',
    loadChildren: () =>
      import('./maintenance-records/maintenance-records.module').then(
        m => m.MaintenanceRecordsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JudicialPhysicalReceptionRoutingModule {}
