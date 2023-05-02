import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/guards/auth.guard';

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
    path: 'create-deductives',
    loadChildren: async () =>
      (await import('./deductives/deductives.module')).DeductivesModule,
    data: { title: 'Deductivas' },
  },
  {
    path: 'create-deductives-verification',
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
    path: 'sat-clasification',
    loadChildren: async () =>
      (await import('./sat-classification/sat-classification.module'))
        .SatClasificationModule,
    data: { title: 'Sat Clasificación' },
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
      (await import('./legal-support/legal-support.module')).LegalSupportModule,
    data: { title: 'Soporte Legal' },
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
    path: 'identifier',
    loadChildren: async () =>
      (await import('./identifiers/identifiers.module')).IdentifiersModule,
    data: { title: 'Identificador' },
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
    path: 'label-okey',
    loadChildren: async () =>
      (await import('./label-okey/label-okey.module')).LabelOkeyModule,
    data: { title: 'Etiquetas Bien' },
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
    data: { title: 'Valores Guardados' },
  },
  {
    path: 'indicated',
    loadChildren: async () =>
      (await import('./indicated/indicated.module')).IndicatedModule,
    data: { title: 'Indiciados' },
  },
  {
    path: 'good-ssubtypes',
    loadChildren: async () =>
      (await import('./good-ssubtypes/good-ssubtypes.module'))
        .GoodSsubtypesModule,
    data: { title: 'Ssubtipo Bien' },
  },
  {
    path: 'good-sssubtypes',
    loadChildren: async () =>
      (await import('./good-sssubtypes/good-sssubtypes.module'))
        .GoodSssubtypesModule,
    data: { title: 'Sssubtipo bien' },
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
    path: 'expert',
    loadChildren: async () =>
      (await import('./experts/experts.module')).ExpertsModule,
    data: { title: 'Peritos' },
  },
  {
    path: 'person',
    loadChildren: async () =>
      (await import('./persons/persons.module')).PersonsModule,
    data: { title: 'Mantto. a administrador, depositario e interventor' },
  },
  {
    path: 'oring',
    loadChildren: async () =>
      (await import('./origin/origin.module')).OriginModule,
    data: { title: 'Procedencias' },
  },
  {
    path: 'oringCisi',
    loadChildren: async () =>
      (await import('./origin-cisi/origin-cisi.module')).OriginCisiModule,
    data: { title: 'Procedencias Cisi' },
  },
  {
    path: 'siseProcess',
    loadChildren: async () =>
      (await import('./sise-process/sise-process.module')).SiseProcessModule,
    data: { title: 'Procesos Sise' },
  },
  {
    path: 'rAsuntDic',
    loadChildren: async () =>
      (await import('./rasunt-dic/rasunt-dic.module')).RAsuntDicModule,
    data: { title: 'R Asunt Dic' },
  },
  {
    path: 'rack',
    loadChildren: async () => (await import('./rack/rack.module')).RackModule,
    data: { title: 'Estante' },
  },
  {
    path: 'regulatory',
    loadChildren: async () =>
      (await import('./regulatory/regulatory.module')).RegulatoryModule,
    data: { title: 'Regulaciones' },
  },
  {
    path: 'responseRepuve',
    loadChildren: async () =>
      (await import('./response-repuve/response-repuve.module'))
        .ResponseRepuveModule,
    data: { title: 'Respuestas Repuve' },
  },
  {
    path: 'batch',
    loadChildren: async () =>
      (await import('./batch/batch.module')).BatchModule,
    data: { title: 'Lotes' },
  },
  {
    path: 'minpub',
    loadChildren: async () =>
      (await import('./minpub/minpub.module')).MinpubModule,
    data: { title: 'Minpub', screen: 'FCATCATMINPUBLICO' },
    canActivate: [AuthGuard],
  },
  {
    path: 'photograph-media',
    loadChildren: async () =>
      (await import('./photograph-media/photograph-media.module'))
        .PhotographMediaModule,
    data: { title: 'Medio Fotografía' },
  },
  {
    path: 'image-media',
    loadChildren: async () =>
      (await import('./image-media/image-media.module')).ImageMediaModule,
    data: { title: 'Medio Imagen' },
  },
  {
    path: 'revision-reason',
    loadChildren: async () =>
      (await import('./revision-reason/revision-reason.module'))
        .RevisionReasonModule,
    data: { title: 'Motivo Revisión' },
  },
  {
    path: 'non-delivery-reasons',
    loadChildren: async () =>
      (await import('./non-delivery-reasons/non-delivery-reasons.module'))
        .NonDeliveryReasonsModule,
    data: { title: 'Motivo No Entrega' },
  },
  {
    path: 'municipalities',
    loadChildren: async () =>
      (await import('./municipalities/municipalities.module'))
        .MunicipalitiesModule,
    data: { title: 'Municipios' },
  },
  {
    path: 'norms',
    loadChildren: async () =>
      (await import('./norms/norms.module')).NormsModule,
    data: { title: 'Normas' },
  },
  {
    path: 'indicator-deadlines',
    loadChildren: async () =>
      (await import('./indicator-deadlines/indicator-deadlines.module'))
        .IndicatorDeadlinesModule,
    data: { title: 'Plazos Indicadores' },
  },
  {
    path: 'notary',
    loadChildren: async () =>
      (await import('./notary/notary.module')).NotaryModule,
    data: { title: 'Notarios' },
  },
  {
    path: 'paragraphs',
    loadChildren: async () =>
      (await import('./paragraphs/paragraphs.module')).ParagraphsModule,
    data: { title: 'Párrafos' },
  },
  {
    path: 'type-docto',
    loadChildren: async () =>
      (await import('./type-docto/type-docto.module')).TypeDoctoModule,
    data: { title: 'Tipo Docto' },
  },
  {
    path: 'type-sinister',
    loadChildren: async () =>
      (await import('./type-sinister/type-sinister.module')).TypeSinisterModule,
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
      (await import('./type-services/type-services.module')).TypeServicesModule,
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
      (await import('./type-relevant/type-relevant.module')).TypeRelevantModule,
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
      (await import('./status-code/status-code.module')).StatusCodeModule,
    data: { title: 'Código estado' },
  },
  {
    path: 'doc-compensation-sat',
    loadChildren: async () =>
      (await import('./doc-compensation-sat/doc-compensation-sat.module'))
        .DocCompensationSatModule,
    data: { title: 'Documentos resarcimiento sat' },
  },
  {
    path: 'indicatorDeadlines',
    loadChildren: async () =>
      (await import('./indicator-deadlines/indicator-deadlines.module'))
        .IndicatorDeadlinesModule,
    data: { title: 'Plazos de Indicadores' },
  },
  {
    path: 'indicatorReport',
    loadChildren: async () =>
      (await import('./indicator-report/indicator-report.module'))
        .IndicatorReportModule,
    data: { title: 'Indicador de Reportes' },
  },
  {
    path: 'generics',
    loadChildren: async () =>
      (await import('./generics/generics.module')).GenericsModule,
    data: { title: 'Genéricos' },
  },
  {
    path: 'issuing-institution',
    loadChildren: async () =>
      (await import('./issuing-institution/issuing-institution.module'))
        .IssuingInstitutionModule,
    data: { title: 'Autoridades Emisoras' },
  },
  {
    path: 'court',
    loadChildren: async () =>
      (await import('./court/court.module')).CourtModule,
    data: { title: 'Juzgados' },
  },
  {
    path: 'siab-clasification',
    loadChildren: async () =>
      (await import('./siab-clasification/siab-clasification.module'))
        .SiabClasificationModule,
    data: { title: 'Clasificación SIAB' },
  },
  {
    path: 'edos-x-coor',
    loadChildren: async () =>
      (await import('./edos-x-coor/edos-x-coor.module')).EdosXCoorModule,
    data: { title: 'Lista de Edos X Coor' },
  },
  {
    path: 'station',
    loadChildren: async () =>
      (await import('./station/station.module')).StationModule,
    data: { title: 'Lista de Emisoras' },
  },
  {
    path: 'third-party-company',
    loadChildren: async () =>
      (await import('./third-party-company/third-party-company.module'))
        .ThirdPartyCompanyModule,
    data: { title: 'Lista de Emisoras' },
  },
  {
    path: 'status-transfer',
    loadChildren: async () =>
      (await import('./status-transfer/status-transfer.module'))
        .StatusTransferModule,
    data: { title: 'Lista estado transferencias' },
  },
  {
    path: 'status-process',
    loadChildren: async () =>
      (await import('./status-process/status-process.module'))
        .StatusProcessModule,
    data: { title: 'Lista estatus proceso' },
  },
  {
    path: 'state-repuves',
    loadChildren: async () =>
      (await import('./state-repuves/state-repuves.module')).StateRepuvesModule,
    data: { title: 'Lista estado repuves' },
  },
  {
    path: 'status-claims',
    loadChildren: async () =>
      (await import('./status-claims/status-claims.module')).StatusClaimsModule,
    data: { title: 'Lista estatus siniestros' },
  },
  {
    path: 'penalty',
    loadChildren: async () =>
      (await import('./penalty/penalty.module')).PenaltyModule,
    data: { title: 'Lista Penalizacion' },
  },
  {
    path: 'payment-concept',
    loadChildren: async () =>
      (await import('./payment-concept/payment-concept.module'))
        .PaymentConceptModule,
    data: { title: 'Concepto de pagos' },
  },
  //Henry
  {
    path: 'affair',
    loadChildren: async () =>
      (await import('./affair/affair.module')).AffairModule,
    data: { title: 'Asuntos' },
  },
  {
    path: 'legal-affair',
    loadChildren: async () =>
      (await import('./legal-affair/legal-affair.module')).LegalAffairModule,
    data: { title: 'Asuntos Jurídicos' },
  },
  {
    path: 'transferors',
    loadChildren: async () =>
      (await import('./transferors/transferors.module')).TransferorsModule,
    data: { title: 'Transferentes por estado' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
