import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertsModule } from './experts/experts.module';

const routes: Routes = [
  {
    path: 'good-types',
    loadChildren: async () =>
      (await import('./good-types/good-types.module')).GoodTypesModule,
    data: { title: 'Tipos de Bien' },
  },
  {
    path: 'good-subtypes',
    loadChildren: async () =>
      (await import('./good-subtypes/good-subtypes.module')).GoodSubtypesModule,
    data: { title: 'Subtipos de Bien' },
  },
  {
    path: 'delegations',
    loadChildren: async () =>
      (await import('./delegations/delegations.module')).DelegationsModule,
    data: { title: 'Delegaciones' },
  },
  {
    path: 'sub-delegations',
    loadChildren: async () =>
      (await import('./sub-delegations/sub-delegations.module'))
        .SubDelegationsModule,
    data: { title: 'Sub Delegaciones' },
  }, 
  {
    path: 'expert',
    loadChildren: async () =>
      (await import('./experts/experts.module'))
        .ExpertsModule,
    data: { title: 'Peritos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
