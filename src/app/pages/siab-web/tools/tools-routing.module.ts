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
    path: 'propertyInm',
    loadChildren: async () =>
      (await import('./propertyInm/propertyInm.module')).PropertyInmModule,
    data: { title: 'Consulta de Muebles' },
  },
  {
    path: 'scanned-documents',
    loadChildren: async () =>
      (await import('./scanned-documents/scanned-documents.module'))
        .ScannedDocumentsModule,
    data: { title: 'Documentos escaneados' },
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
