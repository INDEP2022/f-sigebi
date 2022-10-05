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
    path: 'label-okey',
      loadChildren: async () =>
        (await import('./label-okey/label-okey.module')).LabelOkeyModule,
      data: { title: 'Etiquetas Bien' },
    },
  
    {
      path: 'fractions',
      loadChildren: async () =>
        (await import('./fractions/fractions.module')).FractionsModule,
      data: { title: 'Fracciones' },
    },
  
  
    {
      path: 'drawers',
      loadChildren: async () =>
        (await import('./drawers/drawers.module')).DrawersModule,
      data: { title: 'Gavetas' },
    },
  
  
    {
      path: 'management',
      loadChildren: async () =>
        (await import('./management/management.module')).ManagementModule,
      data: { title: 'Gestión' },
    },
  
    {
      path: 'save-values',
      loadChildren: async () =>
        (await import('./save-values/save-values.module')).SaveValuesModule,
      data: { title: 'Gestión' },
    },
  
    {
      path: 'identifier',
      loadChildren: async () =>
        (await import('./identifiers/identifiers.module')).IdentifiersModule,
      data: { title: 'Identificador' },
    },
  
    {
      path: 'indicated',
      loadChildren: async () =>
        (await import('./indicated/indicated.module')).IndicatedModule,
      data: { title: 'Indiciados' },
    },
  {
    path: 'doc-compensation-sat-xml',
    loadChildren: async () =>
      (await import("./doc-compensation-sat-xml/doc-compensation-sat-xml.module"))
      .DocCompensationSatXmlModule,
      data: {title: "Documentos Resarcimiento Sat XML"}
  },
  {
    path: 'grantees',
    loadChildren: async () =>
      (await import("./grantees/grantees.module"))
      .GranteesModule,
      data: {title: "Donatorios"}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
