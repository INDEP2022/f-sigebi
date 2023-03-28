import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //Henryy
  {
    path: 'cat-financial-information-attributes',
    loadChildren: async () =>
      (
        await import(
          './cat-financial-information-attributes/cat-financial-information-attributes.module'
        )
      ).CatFinancialInformationAttributesModule,
    data: {
      title: 'Atributos de información financiera',
      screen: 'FCATADBATRIBINFIN',
    },
  },
  {
    //YA EXISTE EN CATALOGS
    path: 'cat-financial-indicators',
    loadChildren: async () =>
      (
        await import(
          './cat-financial-indicators/cat-financial-indicators.module'
        )
      ).CatFinancialIndicatorsModule,
    data: {
      title: 'Indicadores financieros',
      screen: 'FCATADBINDICFINAN',
    },
  },
  // NO SE MIGRA
  //{
  //   path: 'question-catalog',
  //   loadChildren: async () =>
  //     (await import('./question-catalog/question-catalog.module'))
  //       .QuestionCatalogModule,
  //   data: { title: 'Preguntas', screen: 'FCATADBINFOREMPRE' },
  // },
  {
    path: 'logical-tables-register',
    loadChildren: async () =>
      (await import('./logical-tables-register/logical-tables-register.module'))
        .LogicalTablesRegisterModule,
    data: { title: 'Tablas lógicas', screen: 'FCATCATALTATABLAS' },
  },
  {
    path: 'flyer-subject-catalog',
    loadChildren: async () =>
      (await import('./flyer-subject-catalog/flyer-subject-catalog.module'))
        .FlyerSubjectCatalogModule,
    data: {
      title: 'Asuntos para volantes',
      screen: 'FCATCATASUNTOS',
    },
  },
  {
    path: 'register-attributes-types',
    loadChildren: async () =>
      (
        await import(
          './register-attributes-types/register-attributes-types.module'
        )
      ).RegisterAttributesTypesModule,
    data: {
      title: 'Alta de atributos por tipo de bien',
      screen: 'FCATCATATRIBXBIEN',
    },
  },
  {
    path: 'cat-effective-numeraire',
    loadChildren: async () =>
      (await import('./cat-effective-numeraire/cat-effective-numeraire.module'))
        .CatEffectiveNumeraireModule,
    data: {
      title: 'Numerario efectivo',
      screen: 'FCATCATCATEGONUME',
    },
  },
  {
    path: 'bank-concepts',
    loadChildren: async () =>
      (await import('./bank-concepts/bank-concepts.module')).BankConceptsModule,
    data: { title: 'Conceptos bancarios', screen: 'FCATCATCONCEPBANC' },
  },
  //YA EXISTE EN CATALOGS
  /*{
    path: 'cat-depository-payment',
    loadChildren: async () =>
      (await import('./cat-depository-payment/cat-depository-payment.module'))
        .CatDepositoryPaymentModule,
    data: {
      title: 'Catalogo de conceptos de pagos depositarias',
      screen: 'FCATCATCONCEPPAGO',
    },
  },*/
  {
    path: 'maintenance-deleg-subdeleg',
    loadChildren: async () =>
      (
        await import(
          './maintenance-deleg-subdeleg/maintenance-deleg-subdeleg.module'
        )
      ).MaintenanceDelegSubdelegModule,
    data: {
      title: 'Mant. a Delegaciones y Subdelegaciones',
      screen: 'FCATCATDELYSUBDEL',
    },
  },
  //YA EXISTE EN CATALOGS
  /*{
    path: 'mnce-adm-depository-auditor',
    loadChildren: async () =>
      (
        await import(
          './mnce-adm-depository-auditor/mnce-adm-depository-auditor.module'
        )
      ).MnceAdmDepositoryAuditorModule,
    data: {
      title: 'Mantto. a administrador, depositario e interventor',
      screen: 'FCATCATDEPOINTEAD',
    },
  },*/
  {
    path: 'attributes-reg-logical-tables',
    loadChildren: async () =>
      (
        await import(
          './attributes-reg-logical-tables/attributes-reg-logical-tables.module'
        )
      ).ttributesRegLogicalTablesModule,
    data: {
      title: 'Registro de atributos para tablas lógicas',
      screen: 'FCATCATDESCATRIBU',
    },
  },
  {
    path: 'register-keys-logical-tables',
    loadChildren: async () =>
      (
        await import(
          './register-keys-logical-tables/register-keys-logical-tables.module'
        )
      ).RegisterKeysLogicalTablesModule,
    data: {
      title: 'Registro de claves para tablas logicas',
      screen: 'FCATCATDESCCLAVES',
    },
  },
  {
    path: 'cat-doc-require',
    loadChildren: async () =>
      (await import('./cat-doc-require/cat-doc-require.module'))
        .CatDocRequireModule,
    data: {
      title: 'Requisitos documentales',
      screen: 'FCATCATDOCUMDICTA',
    },
  },
  {
    path: 'general-archive-catalog',
    loadChildren: async () =>
      (await import('./general-archive-catalog/general-archive-catalog.module'))
        .GeneralArchiveCatalogModule,
    data: { title: 'Archivo General', screen: 'FCATCATGUARDAVALO' },
  },
  {
    path: 'cat-identifier-uni-dbs',
    loadChildren: async () =>
      (await import('./cat-identifier-uni-dbs/cat-identifier-uni-dbs.module'))
        .CatIdentifierUniDbsModule,
    data: {
      title: 'Identificador para la unificacion de las dbs',
      screen: 'FCATCATIDENTIFICADOR',
    },
  },
  {
    path: 'cat-relationship-opinion',
    loadChildren: async () =>
      (
        await import(
          './cat-relationship-opinion/cat-relationship-opinion.module'
        )
      ).CatRelationshipOpinionModule,
    data: {
      title: 'Relación y de asunto dictamen',
      screen: 'FCATADBRELASDIC',
    },
  },
  {
    path: 'cat-transferent',
    loadChildren: async () =>
      (await import('./cat-transferent/cat-transferent.module'))
        .CatTransferentModule,
    data: {
      title: 'Transferentes',
      screen: 'FCATCATTRANSFERENTE',
    },
  },
  {
    path: 'mail',
    loadChildren: async () => (await import('./mail/mail.module')).MailModule,
    data: {
      title: 'Mant. Correos',
      screen: 'FMTODESTCORREOS',
    },
  },

  //Alexander
  {
    path: 'maintenance-of-areas',
    loadChildren: async () =>
      (await import('./maintenance-of-areas/maintenance-of-areas.module'))
        .MaintenanceOfAreasModule,
    data: { title: 'Catálogo de Mantenimiento de Areas' },
  },
  {
    path: 'profile-maintenance',
    loadChildren: async () =>
      (await import('./profile-maintenance/profile-maintenance.module'))
        .ProfileMaintenanceModule,
    data: { title: 'Mantenimiento a perfiles' },
  },
  {
    path: 'maintenance-of-public-ministries',
    loadChildren: async () =>
      (
        await import(
          './maintenance-of-public-ministries/maintenance-of-public-ministries.module'
        )
      ).MaintenanceOfPublicMinistriesModule,
    data: {
      title: 'Mantenimiento a ministerios públicos',
      screen: 'FCATCATMINPUBLICO',
    },
  },
  {
    path: 'wareahouse-catalog',
    loadChildren: async () =>
      (await import('./wareahouse-catalog/wareahouse-catalog.module'))
        .WareahouseCatalogModule,
    data: { title: 'Mantenimiento a ministerios publicos' },
  },
  {
    path: 'banks-catalog',
    loadChildren: async () =>
      (await import('./banks-catalog/banks-catalog.module')).BanksCatalogModule,
    data: { title: 'Catálogo de Bancos', screen: 'FCATCATMTOBANCOS' },
  },
  {
    path: 'filters-of-goods-for-donation',
    loadChildren: async () =>
      (
        await import(
          './filters-of-goods-for-donation/filters-of-goods-for-donation.module'
        )
      ).FiltersOfGoodsForDonationModule,
    data: {
      title: 'Filtros de bienes para donación',
      screen: 'FCATCATMTOFILDONAC',
    },
  },
  {
    path: 'court-maintenance',
    loadChildren: async () =>
      (await import('./court-maintenance/court-maintenance.module'))
        .CourtMaintenanceModule,
    data: { title: 'Mantenimiento a juzgados', screen: 'FCATCATMTOJUZGADO' },
  },
  {
    path: 'maintenance-individuals-and-companies',
    loadChildren: async () =>
      (
        await import(
          './maintenance-individuals-and-companies/maintenance-individuals-and-companies.module'
        )
      ).MaintenanceIndividualsAndCompaniesModule,
    data: {
      title: 'Mantenimiento de personas fisicas y morales',
      screen: 'FCATCATMTOPERSONA',
    },
  },
  {
    path: 'cost-catalog',
    loadChildren: async () =>
      (await import('./cost-catalog/cost-catalog.module')).CostCatalogModule,
    data: {
      title: 'Catálogo de Costos',
    },
  },
  {
    path: 'types-of-claims-catalog',
    loadChildren: async () =>
      (await import('./types-of-claims-catalog/types-of-claims-catalog.module'))
        .TypesOfClaimsCatalogModule,
    data: {
      title: 'Catálogo de tipos de siniestro',
    },
  },
  {
    path: 'indicia-registration',
    loadChildren: async () =>
      (await import('./indicia-registration/indicia-registration.module'))
        .IndiciaRegistrationModule,
    data: {
      title: 'Registro de Indiciados',
    },
  },
  {
    path: 'rate-catalog',
    loadChildren: async () =>
      (await import('./rate-catalog/rate-catalog.module')).RateCatalogModule,
    data: {
      title: 'Catálogo de tasas',
    },
  },
  {
    path: 'numerary-parameterization',
    loadChildren: async () =>
      (
        await import(
          './numerary-parameterization/numerary-parameterization.module'
        )
      ).NumeraryParameterizationModule,
    data: {
      title: 'Parametrización de numerario',
    },
  },
  {
    path: 'parameter-maintenance',
    loadChildren: async () =>
      (await import('./parameter-maintenance/parameter-maintenance.module'))
        .ParameterMaintenanceModule,
    data: {
      title: 'Mantenimiento de parámetros',
      screen: 'FCATCATPARAMETROS',
    },
  },
  {
    path: 'maximum-times-for-abandonment',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-maximum-times-for-abandonment/c-p-m-maximum-times-for-abandonment.module'
        )
      ).CPMMaximumTimesForAbandonmentModule,
    data: {
      title: 'Tiempos Maximos para abandono',
      screen: 'FCATCATTIEMPOABAN',
    },
  },
  {
    path: 'catalog-of-document-types',
    loadChildren: async () =>
      (
        await import(
          './catalog-of-document-types/catalog-of-document-types.module'
        )
      ).CatalogOfDocumentTypesModule,
    data: {
      title: 'Catálogo de tipos de documentos',
      screen: 'FCATCATTIPOSDOCUM',
    },
  },
  {
    path: 'catalog-of-inventory-types',
    loadChildren: async () =>
      (
        await import(
          './catalog-of-inventory-types/catalog-of-inventory-types.module'
        )
      ).CatalogOfInventoryTypesModule,
    data: {
      title: 'Catálogo de tipos de inventario',
      screen: 'FCATCATTIPOSINVEN',
    },
  },
  //Félix
  {
    path: 'values',
    loadChildren: async () =>
      (await import('./values/values.module')).ValuesModule,
    data: { title: 'Valores', screen: 'FCATCATVALORTABL1' },
  },
  {
    path: 'additional-values',
    loadChildren: async () =>
      (await import('./additional-values/additional-values.module'))
        .AdditionalValuesModule,
    data: { title: 'Valores Adicionales', screen: 'FCATCATVALORTABL5' },
  },
  {
    path: 'appraisal-institutions',
    loadChildren: async () =>
      (await import('./appraisal-institutions/appraisal-institutions.module'))
        .AppraisalInstitutionsModule,
    data: { title: 'Instituciones Valuadoras', screen: 'FCATCATVALUADORES' },
  },
  {
    path: 'non-working-days',
    loadChildren: async () =>
      (await import('./non-working-days/non-working-days.module'))
        .NonWorkingDaysModule,
    data: { title: 'Días Inhábiles', screen: 'FDIASINHABILES' },
  },
  {
    path: 'date-documents',
    loadChildren: async () =>
      (await import('./date-documents/date-documents.module'))
        .DateDocumentsModule,
    data: { title: 'Fechas para Documentos', screen: 'Fecha_x_Docum' },
  },
  {
    path: 'indicators-of-performance',
    loadChildren: async () =>
      (
        await import(
          './indicators-of-performance/indicators-of-performance.module'
        )
      ).IndicatorsOfPerformanceModule,
    data: { title: 'Indicadores de Desempeño', screen: 'FINDICA_0009' },
  },
  {
    path: 'maintenance-document-validators',
    loadChildren: async () =>
      (
        await import(
          './maintenance-document-validators/maintenance-document-validators.module'
        )
      ).MaintenanceDocumentValidatorsModule,
    data: {
      title: 'Mantenimiento a validadores de actas',
      screen: 'FMTOVALIDADORES',
    },
  },
  {
    path: 'maximum-times',
    loadChildren: async () =>
      (await import('./maximum-times/maximum-times.module')).MaximumTimesModule,
    data: {
      title: 'Tiempo Máximo Para Cierre Actas Devolución',
      screen: 'TMPMAXCIERREACTDEV',
    },
  },
  {
    path: 'cat-appraisers',
    loadChildren: async () =>
      (await import('./cat-appraisers/cat-appraisers.module'))
        .CatAppraisersModule,
    data: {
      title: 'Catálago de Peritos',
      screen: 'FCATCATMTOPERITOS',
    },
  },
  {
    path: 'cat-of-separators-documents',
    loadChildren: async () =>
      (
        await import(
          './cat-of-separators-documents/cat-of-separators-documents.module'
        )
      ).CatOfSeparatorsDocumentsModule,
    data: {
      title: 'Catálogo de separadores a documentos',
      screen: 'FCATCATSEPARDOCUM',
    },
  },
  {
    path: 'cat-types-of-goods',
    loadChildren: async () =>
      (await import('./cat-types-of-goods/cat-types-of-goods.module'))
        .CatTypesOfGoodsModule,
    data: {
      title: 'Catálogo de tipos de bienes',
      screen: 'FCATCATTIPOSDBIEN',
    },
  },
  // CatOfSeparatorsDocumentsModule
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterizationRoutingModule {}
