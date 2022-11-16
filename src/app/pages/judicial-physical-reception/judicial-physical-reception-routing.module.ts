import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'articles-complement',
    loadChildren: () =>
      import('./jpr-complement-article/jpr-complement-article.module').then(
        m => m.JprComplementArticleModule
      ),
  },
  {
    path: 'confiscated-reception',
    loadChildren: () =>
      import(
        './jpr-confiscated-reception/jpr-confiscated-reception.module'
      ).then(m => m.JprConfiscatedReceptionModule),
  },
  {
    path: 'records-report',
    loadChildren: () =>
      import('./jpr-records-report/jpr-records-report.module').then(
        m => m.JprRecordsReportModule
      ),
  },
  {
    path: 'confiscated-records',
    loadChildren: () =>
      import('./jpr-confiscated-records/jpr-confiscated-records.module').then(
        m => m.JprConfiscatedRecordsModule
      ),
  },
  {
    path: "partializes-general-goods-1",
    loadChildren: () =>
      import("./jpr-partializes-general-goods-1/jpr-partializes-general-goods.module").then(
        (m) => m.JprPartializesGeneralGoodsModule
      ),
  },
  {
    path: "partializes-general-goods-2",
    loadChildren: () =>
      import("./jpr-partializes-general-goods-2/jpr-partializes-general-goods.module").then(
        (m) => m.JprPartializesGeneralGoodsModule
      ),
  },
  {
    path: "partializes-goods",
    loadChildren: () =>
      import("./jpr-partializes-goods/jpr-partializes-goods.module").then(
        (m) => m.JprPartializesGoodsModule
      ),
  },
  {
    path: "cancellation-recepcion",
    loadChildren: () =>
      import("./jpr-cancellation-recepcion/jpr-cancellation-recepcion.module").then(
        (m) => m.JprCancellationRecepcionModule
      ),
  },
  {
    path: "cancellation-sale",
    loadChildren: () =>
      import("./jpr-sale-cancellation/jpr-sale-cancellation.module").then(
        (m) => m.JprSaleCancellationModule
      ),
  },
  {
    path: "scheduled-maintenance-1",
    loadChildren: () =>
      import("./jpr-scheduled-maintenance-1/jpr-scheduled-maintenance.module").then(
        (m) => m.JprScheduledMaintenanceModule
      ),
  },

  {
    path: "scheduled-maintenance-2",
    loadChildren: () =>
      import("./jpr-scheduled-maintenance-2/jpr-scheduled-maintenance.module").then(
        (m) => m.JprScheduledMaintenanceModule
      ),
  },
   {
    path: "maintenance-records",
    loadChildren: () =>
      import("./jpr-maintenance-records/jpr-maintenance-records.module").then(
        (m) => m.JprMaintenanceRecordsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JudicialPhysicalReceptionRoutingModule {}
