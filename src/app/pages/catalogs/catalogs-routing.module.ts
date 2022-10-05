import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    path: 'sat-clasification',
    loadChildren: async () =>
      (await import('./sat-classification/sat-classification.module'))
        .SatClasificationModule,
    data: { title: 'Sat Clasificacion' },
  },
  {
    path: 'sat-subclasification',
    loadChildren: async () =>
      (await import('./sat-subclassification/sat-subclassification.module'))
        .SatSubclassificationModule,
    data: { title: 'Sat Subclasificacion' },
  },
  {
    path: 'services',
    loadChildren: async () =>
      (await import('./cat-services/cat-services.module')).CatServicesModule,
    data: { title: 'Servicios' },
  },
  {
    path: 'ifai-series',
    loadChildren: async () =>
      (await import('./ifai-series/ifai-series.module')).IfaiSeriesModule,
    data: { title: 'Series Ifai' },
  },
  {
    path: 'good-situation',
    loadChildren: async () =>
      (await import('./good-situation/good-situation.module'))
        .GoodSituationModule,
    data: { title: 'Situacion Bien' },
  },
  {
    path: 'legal-support',
    loadChildren: async () =>
      (await import('./legal-support/legal-support.module'))
        .LegalSupportModule,
    data: { title: 'Soporte Legal' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
