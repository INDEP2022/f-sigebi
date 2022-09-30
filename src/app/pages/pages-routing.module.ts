import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'example',
    loadChildren: async () =>
      (await import('./example/example.module')).ExampleModule,
    data: { title: 'Ejemplo' },
  },
  {
    path: 'good-types',
    loadChildren: async () =>
      (await import('./catalogs/good-types/good-types.module')).GoodTypesModule,
    data: { title: 'Tipos de Bien' },
  },
  {
    path: 'good-subtypes',
    loadChildren: async () =>
      (await import('./catalogs/good-subtypes/good-subtypes.module'))
        .GoodSubtypesModule,
    data: { title: 'Subtipos de Bien' },
  },
  {
    path: 'delegations',
    loadChildren: async () =>
      (await import('./catalogs/delegations/delegations.module'))
        .DelegationsModule,
    data: { title: 'Delegaciones' },
  },
  {
    path: 'sub-delegations',
    loadChildren: async () =>
      (await import('./catalogs/sub-delegations/sub-delegations.module'))
        .SubDelegationsModule,
    data: { title: 'Sub Delegaciones' },
  },
  {
    path: 'home',
    loadChildren: async () =>
      (await import('./admin/home/home.module')).HomeModule,
    data: { title: 'Inicio' },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
