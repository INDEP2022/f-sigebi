import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //Henry
  {
    path: 'c-p-m-cat-financial-information-attributes',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-financial-information-attributes/c-p-m-cat-financial-information-attributes.module'
        )
      ).CPMCatFinancialInformationAttributesModule,
    data: { title: 'Catálogo de atributos de información financiera' },
  },
  {
    path: 'c-p-m-cat-financial-indicators',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-financial-indicators/c-p-m-cat-financial-indicators.module'
        )
      ).CPMCatFinancialIndicatorsModule,
    data: { title: 'Catálogo de indicadores financieros' },
  },
  {
    path: 'c-p-m-question-catalog',
    loadChildren: async () =>
      (await import('./c-p-m-question-catalog/c-p-m-question-catalog.module'))
        .CPMQuestionCatalogModule,
    data: { title: 'Catálogo de preguntas' },
  },
  {
    path: 'c-p-m-logical-tables-register',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-logical-tables-register/c-p-m-logical-tables-register.module'
        )
      ).CPMLogicalTablesRegisterModule,
    data: { title: 'Catálogo de tablas lógicas' },
  },
  {
    path: 'c-p-m-flyer-subject-catalog',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-flyer-subject-catalog/c-p-m-flyer-subject-catalog.module'
        )
      ).CPMFlyerSubjectCatalogModule,
    data: { title: 'Catálogo de asuntos para volantes' },
  },
  {
    path: 'c-p-m-register-attributes-types',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-register-attributes-types/c-p-m-register-attributes-types.module'
        )
      ).CPMRegisterAttributesTypesModule,
    data: { title: 'Alta de atributos por tipo de bien' },
  },
  {
    path: 'c-p-m-cat-effective-numeraire',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-effective-numeraire/c-p-m-cat-effective-numeraire.module'
        )
      ).CPMCatEffectiveNumeraireModule,
    data: { title: 'Categoria para numerario efectivo' },
  },
  {
    path: 'c-p-m-bank-concepts',
    loadChildren: async () =>
      (await import('./c-p-m-bank-concepts/c-p-m-bank-concepts.module'))
        .CPMBankConceptsModule,
    data: { title: 'Conceptos bancarios' },
  },
  {
    path: 'c-p-m-cat-depository-payment',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-cat-depository-payment/c-p-m-cat-depository-payment.module'
        )
      ).CPMCatDepositoryPaymentModule,
    data: { title: 'Catalogo de conceptos de pagos depositarias' },
  },
  {
    path: 'c-p-m-maintenance-deleg-subdeleg',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-maintenance-deleg-subdeleg/c-p-m-maintenance-deleg-subdeleg.module'
        )
      ).CPMMaintenanceDelegSubdelegModule,
    data: { title: 'Mant. a delegaciones y subdelegaciones' },
  },
  {
    path: 'c-p-m-mnce-adm-depository-auditor',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-mnce-adm-depository-auditor/c-p-m-mnce-adm-depository-auditor.module'
        )
      ).CPMMnceAdmDepositoryAuditorModule,
    data: { title: 'Mantto. a administrador, depositario e interventor' },
  },
  //Alexander
  {
    path: 'maintenance-of-areas',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-maintenance-of-areas/c-p-m-maintenance-of-areas.module'
        )
      ).CPMMaintenanceOfAreasModule,
    data: { title: 'Catálogo de Mantenimiento de Areas' },
  },
  {
    path: 'profile-maintenance',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-profile-maintenance/c-p-m-profile-maintenance.module'
        )
      ).CPMProfileMaintenanceModule,
    data: { title: 'Mantenimiento a perfiles' },
  },
  {
    path: 'maintenance-of-public-ministries',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-maintenance-of-public-ministries/c-p-m-maintenance-of-public-ministries.module'
        )
      ).CPMMaintenanceOfPublicMinistriesModule,
    data: { title: 'Mantenimiento a ministerios publicos' },
  },
  {
    path: 'wareahouse-catalog',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-wareahouse-catalog/c-p-m-wareahouse-catalog.module'
        )
      ).CPMWareahouseCatalogModule,
    data: { title: 'Mantenimiento a ministerios publicos' },
  },
  //Félix
  {
    path: 'values',
    loadChildren: async () =>
      (await import('./c-p-m-values/c-p-m-values.module')).CPMValuesModule,
    data: { title: 'Valores' },
  },
  {
    path: 'additional-values',
    loadChildren: async () =>
      (await import('./c-p-m-additional-values/c-p-m-additional-values.module'))
        .CPMAdditionalValuesModule,
    data: { title: 'Valores Adicionales' },
  },
  {
    path: 'appraisal-institutions',
    loadChildren: async () =>
      (
        await import(
          './c-p-m-appraisal-institutions/c-p-m-appraisal-institutions.module'
        )
      ).CPMAppraisalInstitutionsModule,
    data: { title: 'Instituciones Valuadoras' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterizationRoutingModule {}
