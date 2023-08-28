import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'property',
    loadChildren: async () =>
      (await import('./property/property.module')).PropertyModule,
    data: { title: 'Consulta de inmuebles' },
  },
  {
    path: 'scanned-documents',
    loadChildren: async () =>
      (await import('./scanned-documents/scanned-documents.module'))
        .ScannedDocumentsModule,
    data: { title: 'Documentos escaneados' },
  },
  {
    path: 'outside-trades',
    loadChildren: async () =>
      (await import('./outside-trades/outside-trades.module'))
        .OutsideTradesModule,
    data: { title: 'Oficios externos', screen: 'Oficios_Externos.aspx' },
  },
  {
    path: 'inside-trades',
    loadChildren: async () =>
      (await import('./inside-trades/inside-trades.module')).InsideTradesModule,
    data: { title: 'Oficios internos', screen: 'Oficios_Internos.aspx' },
  },
  {
    path: 'query-interconnection',
    loadChildren: async () =>
      (await import('./query-interconnection/query-interconnection.module'))
        .QueryInterconnectionModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsRoutingModule {}
