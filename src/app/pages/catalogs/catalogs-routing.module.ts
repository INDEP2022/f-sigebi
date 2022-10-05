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
    path: 'sub-delegations',
    loadChildren: async () =>
      (await import('./sub-delegations/sub-delegations.module'))
        .SubDelegationsModule,
    data: { title: 'Sub Delegaciones' },
  },
  {
    path: 'deductives',
    loadChildren: async () =>
      (await import('./deductives/deductives.module')).DeductivesModule,
    data: { title: 'Deductivas' },
  },
  {
    path: 'deductives-verification',
    loadChildren: async () =>
      (await import('./deductives-verification/deductives-verification.module'))
        .DeductivesVerificationModule,
    data: { title: 'Deductivas Verificación' },
  },
  {
    path: 'delegations',
    loadChildren: async () =>
      (await import('./delegations/delegations.module')).DelegationsModule,
    data: { title: 'Delegaciones' },
  },
  {
    path: 'delegations-state',
    loadChildren: async () =>
      (await import('./delegation-state/delegation-state.module'))
        .DelegationStateModule,
    data: { title: 'Delegaciones Estado' },
  },
  {
    path: 'regional-delegations',
    loadChildren: async () =>
      (await import('./regional-delegations/regional-delegations.module'))
        .RegionalDelegationsModule,
    data: { title: 'Delegaciones Regionales' },
  },
  {
    path: 'departments',
    loadChildren: async () =>
      (await import('./departments/departments.module')).DepartmentsModule,
    data: { title: 'Departamentos' },
  },
  {
    path: 'offices',
    loadChildren: async () =>
      (await import('./offices/offices.module')).OfficesModule,
    data: { title: 'Despachos' },
  },
  {
    path: 'detail-delegation',
    loadChildren: async () =>
      (await import('./detail-delegation/detail-delegation.module'))
        .DetailDelegationModule,
    data: { title: 'Detalle Delegación' },
  },
  {
    path: 'opinions',
    loadChildren: async () =>
      (await import('./opinions/opinions.module')).OpinionsModule,
    data: { title: 'Dictamenes' },
  },
  {
    path: 'doc-compensation',
    loadChildren: async () =>
      (await import('./doc-compensation/doc-compensation.module'))
        .DocCompensationModule,
    data: { title: 'Documentos de Resarcimientos' },
  },
  {
    path: 'legends',
    loadChildren: async () =>
      (await import('./legends/legends.module')).LegendsModule,
    data: { title: 'Leyendas' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
