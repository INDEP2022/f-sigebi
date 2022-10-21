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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JudicialPhysicalReceptionRoutingModule {}
