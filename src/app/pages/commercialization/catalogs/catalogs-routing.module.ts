import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'penalty-types',
    loadChildren: async () =>
      (await import('./c-c-m-penalty-types/c-c-m-penalty-types.module'))
        .CCMPenaltyTypesModule,
    data: { title: 'Tipos de Penalización' },
  },
  {
    path: 'authorization-keys-ois',
    loadChildren: async () =>
      (
        await import(
          './c-c-m-authorization-keys-ois/c-c-m-authorization-keys-ois.module'
        )
      ).CCMAuthorizationKeysOisModule,
    data: { title: 'Claves de Autorización Envío Ext. OIs' },
  },
  {
    path: 'capture-lines',
    loadChildren: async () =>
      (
        await import(
          './c-c-m-capture-lines/c-c-m-capture-lines.module'
        )
      ).CCMCaptureLinesModule,
    data: { title: 'Líneas de Captura' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogsRoutingModule {}
