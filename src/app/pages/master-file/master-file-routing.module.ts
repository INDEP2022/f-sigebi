import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'documents-sent-to-master-file',
    loadChildren: async () =>
      (
        await import(
          './documents-sent-to-masterfile/documents-sent-to-masterfile.module'
        )
      ).DocumentsSentToMasterfileModule,
    data: {
      title: 'Documentos enviados al A. Mastro',
      screen: 'FACTARGENVIODOCS',
    },
  },
  {
    path: 'loan-monitor',
    loadChildren: async () =>
      (await import('./loan-monitor/loan-monitor.module')).LoanMonitorModule,
    data: { title: 'Monitor de prestamos', screen: 'FACTARGMONPRESTAM' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterFileRoutingModule {}
