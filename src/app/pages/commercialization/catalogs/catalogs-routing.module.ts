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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogsRoutingModule {}
