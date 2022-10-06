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
    path: 'type-docto',
    loadChildren: async () =>
      (await import('./type-docto/type-docto.module'))
        .TypeDoctoModule,
    data: { title: 'Tipo Docto' },
  },
  {
    path: 'type-sinister',
    loadChildren: async () =>
      (await import('./type-sinister/type-sinister.module'))
        .TypeSinisterModule,
    data: { title: 'Tipo Siniestro' },
  },
  {
    path: 'type-wharehouse',
    loadChildren: async () =>
      (await import('./type-wharehouse/type-wharehouse.module'))
        .TypeWharehouseModule,
    data: { title: 'Tipo de Almacenes' },
  },
  {
    path: 'type-services',
    loadChildren: async () =>
      (await import('./type-services/type-services.module'))
        .TypeServicesModule,
    data: { title: 'Tipo de Servicios' },
  },
  {
    path: 'type-order-service',
    loadChildren: async () =>
      (await import('./type-order-service/type-order-service.module'))
        .TypeOrderServiceModule,
    data: { title: 'Tipo Orden Servicio' },
  },
  {
    path: 'type-relevant',
    loadChildren: async () =>
      (await import('./type-relevant/type-relevant.module'))
        .TypeRelevantModule,
    data: { title: 'Tipo relevante' },
  },
  {
    path: 'zone-geographic',
    loadChildren: async () =>
      (await import('./zone-geographic/zone-geographic.module'))
        .ZoneGeographicModule,
    data: { title: 'Zone Geográficas' },
  },
  {
    path: 'claim-conclusion',
    loadChildren: async () =>
      (await import('./claim-conclusion/claim-conclusion.module'))
        .ClaimConclusionModule,
    data: { title: 'Conclusion de siniestros' },
  },
  {
    path: 'status-code',
    loadChildren: async () =>
      (await import('./status-code/status-code.module'))
        .StatusCodeModule,
    data: { title: 'Código estado' },
  },
  {
    path: 'doc-compensation-sat',
    loadChildren: async () =>
      (await import('./doc-compensation-sat/doc-compensation-sat.module'))
        .DocCompensationSatModule,
    data: { title: 'Documentos resarcimiento sat' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
