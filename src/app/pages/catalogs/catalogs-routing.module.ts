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
  {
    path: 'states',
    loadChildren: async () =>
      (await import('./states/states.module')).StatesModule,
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
      (
        await import(
          './doc-compensation-sat-xml/doc-compensation-sat-xml.module'
        )
      ).DocCompensationSatXmlModule,
    data: { title: 'Documentos Resarcimiento Sat XML' },
  },
  {
    path: 'grantees',
    loadChildren: async () =>
      (await import('./grantees/grantees.module')).GranteesModule,
    data: { title: 'Donatorios' },
  },
  {
    path: 'lawyer',
    loadChildren: async () =>
      (await import('./lawyer/lawyer.module')).LawyerModule,
    data: { title: 'Abogados' },
  },
  {
    path: 'clarifications',
    loadChildren: async () =>
      (await import('./clarifications/clarifications.module'))
        .ClarificationsModule,
    data: { title: 'Aclaraciónes' },
  },
  {
    path: 'warehouses',
    loadChildren: async () =>
      (await import('./warehouses/warehouses.module')).WarehousesModule,
    data: { title: 'Almacenes' },
  },
  {
    path: 'banks',
    loadChildren: async () =>
      (await import('./banks/banks.module')).BanksModule,
    data: { title: 'Bancos' },
  },
  {
    path: 'storehouses',
    loadChildren: async () =>
      (await import('./store-house/store-house.module')).StoreHouseModule,
    data: { title: 'Bodegas' },
  },
  {
    path: 'vault',
    loadChildren: async () =>
      (await import('./vault/vault.module')).VaultModule,
    data: { title: 'Bóvedas' },
  },
  {
    path: 'cities',
    loadChildren: async () => (await import('./city/city.module')).CityModule,
    data: { title: 'Ciudades' },
  },
  {
    path: 'intitution-classification',
    loadChildren: async () =>
      (
        await import(
          './institution-classification/institution-classification.module'
        )
      ).InstitutionClassificationModule,
    data: { title: 'Institución Clasificación' },
  },
  {
    path: 'payment-concept',
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
  {
    path: 'person',
    loadChildren: async () =>
      (await import('./persons/persons.module'))
        .PersonsModule,
    data: { title: 'Personas' },
  },
  {
    path: 'oring',
    loadChildren: async () =>
      (await import('./origin/origin.module'))
        .OriginModule,
    data: { title: 'Procedencias' },
  },
  {
    path: 'oringCisi',
    loadChildren: async () =>
      (await import('./origin-cisi/origin-cisi.module'))
        .OriginCisiModule,
    data: { title: 'Procedencias Cisi' },
  },
  {
    path: 'siseProcess',
    loadChildren: async () =>
      (await import('./sise-process/sise-process.module'))
        .SiseProcessModule,
    data: { title: 'Procesos Sise' },
  },
  {
    path: 'rAsuntDic',
    loadChildren: async () =>
      (await import('./rasunt-dic/rasunt-dic.module'))
        .RAsuntDicModule,
    data: { title: 'R Asunt Dic' },
  },
  {
    path: 'rack',
    loadChildren: async () =>
      (await import('./rack/rack.module'))
        .RackModule,
    data: { title: 'Estante' },
  },
  {
    path: 'regulatory',
    loadChildren: async () =>
      (await import('./regulatory/regulatory.module'))
        .RegulatoryModule,
    data: { title: 'Regulaciones' },
  },
  {
    path: 'responseRepuve',
    loadChildren: async () =>
      (await import('./response-repuve/response-repuve.module'))
        .ResponseRepuveModule,
    data: { title: 'Respuestas Repuve' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
